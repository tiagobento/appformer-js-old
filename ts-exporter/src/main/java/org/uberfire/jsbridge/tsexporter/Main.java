package org.uberfire.jsbridge.tsexporter;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;

import org.uberfire.jsbridge.tsexporter.meta.PackageJson;
import org.uberfire.jsbridge.tsexporter.meta.hierarchy.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.Boolean.getBoolean;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Stream.concat;
import static java.util.stream.Stream.empty;
import static javax.tools.Diagnostic.Kind.ERROR;
import static javax.tools.StandardLocation.CLASS_OUTPUT;
import static org.uberfire.jsbridge.tsexporter.Main.ENTRY_POINT;
import static org.uberfire.jsbridge.tsexporter.Main.PORTABLE;
import static org.uberfire.jsbridge.tsexporter.Main.REMOTE;
import static org.uberfire.jsbridge.tsexporter.Utils.createFileIfNotExists;
import static org.uberfire.jsbridge.tsexporter.Utils.distinctBy;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({REMOTE, PORTABLE, ENTRY_POINT})
public class Main extends AbstractProcessor {

    static final String REMOTE = "org.jboss.errai.bus.server.annotations.Remote";
    static final String PORTABLE = "org.jboss.errai.common.client.api.annotations.Portable";
    static final String ENTRY_POINT = "org.jboss.errai.ioc.client.api.EntryPoint";

    private static final String TS_EXPORTER_PACKAGE = "TSExporter";

    public static Types types;
    public static Elements elements;

    @Override
    public synchronized void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        Main.types = processingEnv.getTypeUtils();
        Main.elements = processingEnv.getElementUtils();
    }

    @Override
    public boolean process(final Set<? extends TypeElement> annotations,
                           final RoundEnvironment roundEnv) {

        if (!getBoolean("ts-exporter")) {
            return false;
        }

        try {
            process(roundEnv, annotations.stream().collect(toMap(identity(), roundEnv::getElementsAnnotatedWith)));
            return false;
        } catch (final Exception e) {
            processingEnv.getMessager().printMessage(ERROR, "Error on TypeScript exporter.");
            e.printStackTrace();
            return false;
        }
    }

    private static List<Element> seenPortables = new ArrayList<>();
    private static List<Element> seenRemotes = new ArrayList<>();

    private void process(final RoundEnvironment roundEnv,
                         final Map<TypeElement, Set<? extends Element>> typesByAnnotations) {

        if (!roundEnv.processingOver() && !roundEnv.errorRaised()) {
            typesByAnnotations.forEach((annotation, classes) -> {
                if (REMOTE.equals(annotation.getQualifiedName().toString())) {
                    seenRemotes.addAll(classes);
                } else if (PORTABLE.equals(annotation.getQualifiedName().toString())) {
                    seenPortables.addAll(classes);
                } else if (ENTRY_POINT.equals(annotation.getQualifiedName().toString())) {
                    System.out.println("EntryPoint detected.");
                } else {
                    throw new RuntimeException("Unsupported annotation type.");
                }
            });
        } else {

            long start = System.currentTimeMillis();

            writeExportFile(seenPortables, "portables.txt");
            writeExportFile(seenRemotes, "remotes.txt");

            if (!getBoolean("ts-exporter-generate")) {
                return;
            }

            System.out.println("Generating TypeScript modules...");

            final DependencyGraph dependencyGraph = new DependencyGraph();
            getTsFilesFrom("portables.txt").forEach(dependencyGraph::add);
            getClassesFromErraiAppPropertiesFiles().forEach(dependencyGraph::add);

            getTsFilesFrom("remotes.txt").stream()
                    .map(element -> new RpcCallerTsClass(element, dependencyGraph))
                    .forEach(this::write);

            dependencyGraph.vertices().stream().map(DependencyGraph.Vertex::getPojoClass)
                    .filter(distinctBy(tsClass -> tsClass.getType().toString()))
                    .peek(this::write)
                    .collect(groupingBy(TsClass::getModuleName))
                    .forEach((moduleName, classes) -> write(new PackageJson(moduleName, classes)));

            System.out.println("TypeScript exporter has successfully run. (" + (System.currentTimeMillis() - start) + "ms)");
        }
    }

    private List<TypeElement> getTsFilesFrom(final String exportFileName) {
        return readAllExportFiles(exportFileName).stream().map(elements::getTypeElement).collect(toList());
    }

    private List<String> readAllExportFiles(final String fileName) {
        try {
            return Collections.list(getClass().getClassLoader().getResources(TS_EXPORTER_PACKAGE + "/" + fileName)).stream()
                    .flatMap((URL url) -> {
                        try {
                            final Scanner scanner = new Scanner(url.openStream()).useDelimiter("\\A");
                            return scanner.hasNext() ? stream(scanner.next().split("\n")) : empty();
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }).collect(toList());
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<TypeElement> getClassesFromErraiAppPropertiesFiles() {
        try {
            return Collections.list(getClass().getClassLoader().getResources("META-INF/ErraiApp.properties")).stream()
                    .map(Utils::loadPropertiesFile)
                    .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                    .filter(Optional::isPresent).map(Optional::get)
                    .flatMap(serializableTypes -> stream(serializableTypes.split(" \n?")))
                    .map(fqcn -> elements.getTypeElement(fqcn.trim().replace("$", ".")))
                    .collect(toList());
        } catch (final IOException e) {
            throw new RuntimeException("Error reading ErraiApp.properties files.", e);
        }
    }

    //

    private void writeExportFile(final List<Element> elements,
                                 final String fileName) {

        try {
            System.out.print("Saving export file: " + fileName + "... ");
            try (final Writer writer = processingEnv.getFiler().createResource(CLASS_OUTPUT, TS_EXPORTER_PACKAGE, fileName).openWriter()) {
                writer.write(elements.stream().map(element -> ((TypeElement) element).getQualifiedName().toString()).distinct().collect(joining("\n")));
                System.out.println("saved.");
            }
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void write(final TsClass tsClass) {

        System.out.print("Saving file: " + tsClass.getType() + "...");
        final String targetDir = tsClass.getElement().getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(format("/tmp/ts-exporter/%s/%s.ts", tsClass.getModuleName(), targetDir).replace("/", File.separator));

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), tsClass.toSource().getBytes());
            System.out.println("saved.");
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void write(final PackageJson packageJson) {
        final Path path = Paths.get(format("/tmp/ts-exporter/%s/package.json", packageJson.getModuleName()).replace("/", File.separator));

        try {
            System.out.print("Saving file: " + packageJson.getModuleName() + "/package.json...");
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), packageJson.toSource().getBytes());
            System.out.println("saved.");
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }
}