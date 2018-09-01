package org.uberfire.jsbridge.tsexporter;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

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

import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;

import static java.lang.String.format;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static javax.lang.model.element.ElementKind.PACKAGE;
import static javax.tools.Diagnostic.Kind.ERROR;
import static org.uberfire.jsbridge.tsexporter.Main.PORTABLE;
import static org.uberfire.jsbridge.tsexporter.Main.REMOTE;
import static org.uberfire.jsbridge.tsexporter.Utils.createFileIfNotExists;
import static org.uberfire.jsbridge.tsexporter.Utils.distinctBy;
import static org.uberfire.jsbridge.tsexporter.Utils.getModuleName;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({REMOTE, PORTABLE})
public class Main extends AbstractProcessor {

    static final String REMOTE = "org.jboss.errai.bus.server.annotations.Remote";
    static final String PORTABLE = "org.jboss.errai.common.client.api.annotations.Portable";

    public static Types types;
    public static Elements elements;

    @Override
    public synchronized void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        Main.types = processingEnv.getTypeUtils();
        Main.elements = processingEnv.getElementUtils();
    }

    public boolean process(final Set<? extends TypeElement> annotations,
                           final RoundEnvironment roundEnv) {

        if (!Boolean.getBoolean("ts-export")) {
            return false;
        }

        try {
            return process(roundEnv, annotations.stream().collect(toMap(identity(), roundEnv::getElementsAnnotatedWith)));
        } catch (final Exception e) {
            processingEnv.getMessager().printMessage(ERROR, "Error on TS Exporter.");
            e.printStackTrace();
            return false;
        }
    }

    private boolean process(final RoundEnvironment roundEnv,
                            final Map<TypeElement, Set<? extends Element>> typesByAnnotations) {

        if (!roundEnv.processingOver() && !roundEnv.errorRaised()) {
            typesByAnnotations.forEach(this::processAnnotatedTypes);
        } else {
            exportErraiAppPropertiesModules();
        }

        return false;
    }

    private void processAnnotatedTypes(final TypeElement annotation,
                                       final Set<? extends Element> classes) {

        if (REMOTE.equals(annotation.getQualifiedName().toString())) {
            classes.forEach(this::generateRpcCallerTsClass);
        } else if (PORTABLE.equals(annotation.getQualifiedName().toString())) {
            classes.forEach(this::generatePojoTsClass);
        } else {
            throw new RuntimeException("Unsupported annotation type.");
        }
    }

    private void exportErraiAppPropertiesModules() {
        try {
            Collections.list(getClass().getClassLoader().getResources("META-INF/ErraiApp.properties")).stream()
                    .map(Utils::loadPropertiesFile)
                    .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                    .filter(Optional::isPresent).map(Optional::get)
                    .flatMap(serializableTypes -> Arrays.stream(serializableTypes.split(" \n?")))
                    .map(fqcn -> elements.getTypeElement(fqcn.trim().replace("$", ".")))
                    .forEach(this::generatePojoTsClass);
        } catch (IOException e) {
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

        final RpcCallerTsClass tsClass = new RpcCallerTsClass((TypeElement) element);
        System.out.println("Generating source for " + tsClass.getInterface().getQualifiedName().toString());
        final String source = tsClass.toSource();

        final String targetDir = tsClass.getInterface().getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(format("/tmp/ts-exporter/%s/%s.ts", getModuleName(tsClass.getInterface()), targetDir).replace("/", File.separator));
        System.out.println("Source generated. Saving to " + path.toString());

        tsClass.getDependencies().stream()
                .filter(distinctBy(ImportableTsType::getCanonicalFqcn))
                .map(ImportableTsType::getType)
                .map(DeclaredType::asElement)
                .forEach(this::generatePojoTsClass);

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), source.getBytes());
            System.out.println("Saved.");
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void generatePojoTsClass(final Element element) {

        final Optional<ImportableTsType> importableTsType = new JavaType(element.asType()).translate().toImportableTsType();

        if (!importableTsType.isPresent()) {
            return;
        }

        final PojoTsClass pojoTsClass = new PojoTsClass(importableTsType.get());

        final String relativePath = importableTsType.get().getPath();
        final Path path = Paths.get("/tmp/ts-exporter/" + relativePath + ".ts");
        if (Files.exists(path)) {
            System.out.println(format("Skipping generation of %s because it already exists", relativePath));
            return;
        }

        try {
            Files.createDirectories(path.getParent());
            Files.createFile(path);
            Files.write(path, pojoTsClass.toSource().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        pojoTsClass.getDependencies().stream()
                .map(ImportableTsType::getType)
                .map(DeclaredType::asElement)
                .forEach(this::generatePojoTsClass);
    }
}