package org.uberfire.jsbridge.tsexporter;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Stream;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;

import org.uberfire.jsbridge.tsexporter.meta.PackageJson;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.Boolean.getBoolean;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.Collections.emptyList;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Stream.concat;
import static java.util.stream.Stream.empty;
import static javax.lang.model.element.ElementKind.PACKAGE;
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

            writeExportFile(seenPortables, "portables.txt");
            writeExportFile(seenRemotes, "remotes.txt");

            if (!getBoolean("ts-exporter-generate")) {
                return;
            }

            System.out.println("Generating TypeScript modules...");
            final List<TsClass> allTsClassesToGenerate = new ArrayList<>();
            allTsClassesToGenerate.addAll(getTsFilesFrom("portables.txt", element -> toPojoTsClass(element, new ArrayList<>())));
            allTsClassesToGenerate.addAll(getTsFilesFrom("remotes.txt", element -> toRpcCallerTsClass(element, new ArrayList<>())));
            allTsClassesToGenerate.addAll(generateClassesFromErraiAppPropertiesFiles());
            allTsClassesToGenerate.stream()
                    .filter(distinctBy(s -> s.getType().toString()))
                    .peek(this::write)
                    .collect(groupingBy(TsClass::getModuleName))
                    .forEach((key, value) -> write(new PackageJson(key, value)));

            System.out.println("TypeScript exporter has successfully run.");
        }
    }

    private List<TsClass> getTsFilesFrom(final String exportFileName,
                                         final Function<TypeElement, List<TsClass>> mapping) {

        return readAllExportFiles(exportFileName).stream()
                .peek(fqcn -> System.out.println("Generating: " + fqcn))
                .map(elements::getTypeElement)
                .map(mapping)
                .flatMap(Collection::stream)
                .collect(toList());
    }

    private List<String> readAllExportFiles(final String fileName) {
        try {
            return Collections.list(getClass().getClassLoader().getResources(TS_EXPORTER_PACKAGE + "/" + fileName)).stream().flatMap(url -> {
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

    private List<TsClass> generateClassesFromErraiAppPropertiesFiles() {
        final List<TsClass> visited = new ArrayList<>();
        try {
            return Collections.list(getClass().getClassLoader().getResources("META-INF/ErraiApp.properties")).stream()
                    .map(Utils::loadPropertiesFile)
                    .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                    .filter(Optional::isPresent).map(Optional::get)
                    .flatMap(serializableTypes -> stream(serializableTypes.split(" \n?")))
                    .map(fqcn -> elements.getTypeElement(fqcn.trim().replace("$", ".")))
                    .flatMap(element -> toPojoTsClass(element, visited).stream())
                    .collect(toList());
        } catch (final IOException e) {
            throw new RuntimeException("Error reading ErraiApp.properties files.", e);
        }
    }

    private List<TsClass> toRpcCallerTsClass(final Element element,
                                             final List<TsClass> visited) {

        if (!element.getKind().isInterface()) {
            System.out.println(element.getSimpleName() + " is not an Interface. That's not supported.");
            return emptyList();
        }

        if (!element.getEnclosingElement().getKind().equals(PACKAGE)) {
            System.out.println(element.getSimpleName() + " is probably an inner Class. That's not supported.");
            return emptyList();
        }

        final RpcCallerTsClass tsClass = new RpcCallerTsClass((TypeElement) element);
        return concat(Stream.of(tsClass), getDependencies(tsClass, visited).stream()).collect(toList());
    }

    private List<TsClass> toPojoTsClass(final Element element,
                                        final List<TsClass> visited) {

        final TsClass tsClass = new PojoTsClass((DeclaredType) element.asType());

        if (visited.stream().anyMatch(c -> c.getType().toString().equals(tsClass.getType().toString()))) {
            return emptyList();
        } else {
            visited.add(tsClass);
        }

        return concat(Stream.of(tsClass), getDependencies(tsClass, visited).stream()).collect(toList());
    }

    private List<TsClass> getDependencies(final TsClass tsClass,
                                          final List<TsClass> visited) {

        return tsClass.getDependencies().stream()
                .map(DeclaredType::asElement)
                .flatMap(element -> toPojoTsClass(element, visited).stream())
                .collect(toList());
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