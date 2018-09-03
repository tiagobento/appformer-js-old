package org.uberfire.jsbridge.tsexporter;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
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
import java.util.function.Consumer;

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

import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.Boolean.getBoolean;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static javax.lang.model.element.ElementKind.PACKAGE;
import static javax.tools.Diagnostic.Kind.ERROR;
import static javax.tools.StandardLocation.CLASS_OUTPUT;
import static org.uberfire.jsbridge.tsexporter.Main.ENTRY_POINT;
import static org.uberfire.jsbridge.tsexporter.Main.PORTABLE;
import static org.uberfire.jsbridge.tsexporter.Main.REMOTE;
import static org.uberfire.jsbridge.tsexporter.Utils.createFileIfNotExists;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({REMOTE, PORTABLE, ENTRY_POINT})
public class Main extends AbstractProcessor {

    static final String REMOTE = "org.jboss.errai.bus.server.annotations.Remote";
    static final String PORTABLE = "org.jboss.errai.common.client.api.annotations.Portable";
    static final String ENTRY_POINT = "org.jboss.errai.ioc.client.api.EntryPoint";

    public static Types types;
    public static Elements elements;

    private static List<Element> seenPortables = new ArrayList<>();
    private static List<Element> seenRemotes = new ArrayList<>();

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
            saveExportFile(seenPortables, "portables.txt");
            saveExportFile(seenRemotes, "remotes.txt");

            if (!getBoolean("ts-exporter-generate")) {
                return;
            }

            System.out.println("Generating...");
            generateFilesFrom("portables.txt", this::generatePojoTsClass);
            generateFilesFrom("remotes.txt", this::generateRpcCallerTsClass);
            generateClassesFromErraiAppPropertiesFiles();
        }
    }

    private void saveExportFile(final List<Element> seen,
                                final String fileName) {

        try {
            System.out.println("Saving export file: " + fileName + "...");
            try (final Writer writer = processingEnv.getFiler().createResource(CLASS_OUTPUT, "TSExporter", fileName).openWriter()) {
                writer.write(seen.stream().map(element -> ((TypeElement) element).getQualifiedName().toString()).distinct().collect(joining("\n")));
            }
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void generateFilesFrom(final String fileName,
                                   final Consumer<TypeElement> action) {

        readAllExportFiles(fileName).stream()
                .filter(fqcn -> !fqcn.trim().equals(""))
                .peek(fqcn -> System.out.println("Generating: " + fqcn))
                .map(elements::getTypeElement)
                .forEach(action);
    }

    private List<String> readAllExportFiles(final String fileName) {
        try {
            return Collections.list(getClass().getClassLoader().getResources("TSExporter/" + fileName)).stream().flatMap(url -> {
                try {
                    final Scanner scanner = new Scanner(url.openStream()).useDelimiter("\\A");
                    return stream((scanner.hasNext() ? scanner.next() : "").split("\n"));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(toList());
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void generateClassesFromErraiAppPropertiesFiles() {
        try {
            Collections.list(getClass().getClassLoader().getResources("META-INF/ErraiApp.properties")).stream()
                    .map(Utils::loadPropertiesFile)
                    .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                    .filter(Optional::isPresent).map(Optional::get)
                    .flatMap(serializableTypes -> stream(serializableTypes.split(" \n?")))
                    .map(fqcn -> elements.getTypeElement(fqcn.trim().replace("$", ".")))
                    .forEach(this::generatePojoTsClass);
        } catch (final IOException e) {
            throw new RuntimeException("Error reading ErraiApp.properties files.", e);
        }
    }

    private void generateRpcCallerTsClass(final Element element) {

        if (!element.getKind().isInterface()) {
            System.out.println(element.getSimpleName() + " is not an Interface. That's not supported.");
            return;
        }

        if (!element.getEnclosingElement().getKind().equals(PACKAGE)) {
            System.out.println(element.getSimpleName() + " is probably an inner Class. That's not supported.");
            return;
        }

        generateAndSaveFileWithDependencies(new RpcCallerTsClass((TypeElement) element));
    }

    private void generatePojoTsClass(final Element element) {

        final TsClass pojoTsClass = new PojoTsClass((DeclaredType) element.asType());

        if (Files.exists(getPath(pojoTsClass))) {
            return;
        }

        generateAndSaveFileWithDependencies(pojoTsClass);
    }

    private Path getPath(final TsClass tsClass) {
        final String targetDir = tsClass.getElement().getQualifiedName().toString().replace(".", "/");
        return Paths.get(format("/tmp/ts-exporter/%s/%s.ts", tsClass.getModuleName(), targetDir).replace("/", File.separator));
    }

    private void generateAndSaveFileWithDependencies(final TsClass tsClass) {

        final Path path = getPath(tsClass);

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), tsClass.toSource().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        tsClass.getDependencies().stream()
                .map(DeclaredType::asElement)
                .forEach(this::generatePojoTsClass);
    }
}