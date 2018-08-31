package org.uberfire.jsbridge.tsexporter;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;

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

import org.uberfire.jsbridge.tsexporter.meta.ImportableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static javax.lang.model.element.ElementKind.PACKAGE;
import static javax.tools.Diagnostic.Kind.ERROR;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({"org.jboss.errai.bus.server.annotations.Remote", "org.jboss.errai.common.client.api.annotations.Portable"})
public class Main extends AbstractProcessor {

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
        try {
            if (!Boolean.getBoolean("ts-export")) {
                return false;
            }

            if (roundEnv.processingOver() || roundEnv.errorRaised()) {
                try {
                    final Enumeration<URL> resources = this.getClass().getClassLoader().getResources("META-INF/ErraiApp.properties");
                    Collections.list(resources).stream()
                            .map(this::loadPropertiesFile)
                            .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                            .filter(Optional::isPresent).map(Optional::get)
                            .flatMap(serializableTypes -> Arrays.stream(serializableTypes.split(" \n?")))
                            .map(String::trim)
                            .map(fqcn -> elements.getTypeElement(fqcn.replace("$", ".")))
                            .map(typeElement -> new JavaType(typeElement.asType()).asImportableJavaType())
                            .map(javaType -> javaType.flatMap(ImportableJavaType::asImportableTsType))
                            .filter(Optional::isPresent).map(Optional::get)
                            .peek(s -> System.out.println("WW!!: generating pojo " + s.getType()))
                            .forEach(this::generatePojoTsClassFile);
                } catch (final IOException e) {
                    System.out.println("Failed to read ErraiApp.properties files");
                }

                return false;
            }

            annotations.stream()
                    .collect(toMap(s -> s, roundEnv::getElementsAnnotatedWith))
                    .forEach((annotation, classes) -> {
                        if (annotation.toString().contains("Remote")) {
                            classes.forEach(this::generateTypeScriptFile);
                        } else {
                            classes.stream()
                                    .map(s -> new JavaType(s.asType()).asImportableJavaType())
                                    .filter(Optional::isPresent).map(Optional::get)
                                    .map(ImportableJavaType::asImportableTsType)
                                    .filter(Optional::isPresent).map(Optional::get)
                                    .forEach(this::generatePojoTsClassFile);
                        }
                    });
            System.out.println("TypeScript files exported successfully.");
        } catch (final Exception e) {
            processingEnv.getMessager().printMessage(ERROR, "Error on TS Exporter");
            e.printStackTrace();
        }

        return false;
    }

    private void generateTypeScriptFile(final Element element) {

        if (!element.getKind().isInterface()) {
            System.out.println(element.getSimpleName() + " is not an Interface. That's not supported.");
            return;
        }

        if (!element.getEnclosingElement().getKind().equals(PACKAGE)) {
            System.out.println(element.getSimpleName() + " is probably an inner Class. That's not supported.");
            return;
        }

        final RpcCallerTsClass rpcCallerTsClass = new RpcCallerTsClass((TypeElement) element);
        generateRemoteRpcTsClassFile(rpcCallerTsClass);

        rpcCallerTsClass.getDependencies().stream()
                .filter(distinctBy(ImportableTsType::getCanonicalFqcn))
                .forEach(this::generatePojoTsClassFile);
    }

    private Properties loadPropertiesFile(final URL fileUrl) {
        final Properties properties = new Properties();
        try {
            properties.load(fileUrl.openStream());
        } catch (final IOException e) {
            System.out.println("Failed to read ErraiApp.properties files");
        }
        return properties;
    }

    private void generateRemoteRpcTsClassFile(final RpcCallerTsClass tsClass) {
        System.out.println("Generating source for " + tsClass.getInterface().getQualifiedName().toString());
        final String source = tsClass.toSource();

        final String targetDir = tsClass.getInterface().getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(format("/tmp/ts-exporter/%s/%s.ts", getModuleName(tsClass.getInterface()), targetDir).replace("/", File.separator));
        System.out.println("Source generated. Saving to " + path.toString());

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), source.getBytes());
            System.out.println("Saved.");
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    public static String lines(final String... lines) {
        return Arrays.stream(lines).collect(joining("\n"));
    }

    public static String getModuleName(final TypeElement typeElement) {
        try {
            final Field sourceFileField = typeElement.getClass().getField("sourcefile");
            sourceFileField.setAccessible(true);
            final String sourceFilePath = sourceFileField.get(typeElement).toString();

            if (sourceFilePath.contains("/src/main/java")) {
                final String[] sourceFilePathParts = sourceFilePath.split("/src/main/java")[0].split("/");
                return sourceFilePathParts[sourceFilePathParts.length - 1];
            }

            if (sourceFilePath.contains("/target/generated-sources")) {
                final String[] sourceFilePathParts = sourceFilePath.split("/target/generated-sources")[0].split("/");
                return sourceFilePathParts[sourceFilePathParts.length - 1];
            }

            if (sourceFilePath.contains("/src/test/java")) {
                final String[] sourceFilePathParts = sourceFilePath.split("/src/test/java")[0].split("/");
                return sourceFilePathParts[sourceFilePathParts.length - 1] + "-test";
            }

            if (sourceFilePath.contains("/target/generated-test-sources")) {
                final String[] sourceFilePathParts = sourceFilePath.split("/target/generated-test-sources")[0].split("/");
                return sourceFilePathParts[sourceFilePathParts.length - 1] + "-test";
            }

            throw new RuntimeException("Module name unretrievable from [" + sourceFilePath + "]");
        } catch (final Exception e) {
            throw new RuntimeException("Error while reading [sourcefile] field from @Remote interface element.", e);
        }
    }

    private void generatePojoTsClassFile(final ImportableTsType importableTsType) {
        final PojoTsClass pojoTsClass = new PojoTsClass(importableTsType);

        final String relativePath = importableTsType.getPath();
        final Path path = Paths.get("/tmp/ts-exporter/" + relativePath + ".ts");
        if (Files.exists(path)) {
            System.out.println(format("Skipping generation of %s because it already exists", relativePath));
            return;
        }

        try {
            Files.createDirectories(path.getParent());
            Files.createFile(path);
            Files.write(path, pojoTsClass.toSource().getBytes());
            pojoTsClass.getDependencies().forEach(this::generatePojoTsClassFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Path createFileIfNotExists(final Path path) throws IOException {
        return path.toFile().exists() ? path : Files.createFile(path);
    }

    public static <T> Predicate<T> distinctBy(final Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }
}