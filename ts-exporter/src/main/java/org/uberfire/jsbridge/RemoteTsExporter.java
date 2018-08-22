package org.uberfire.jsbridge;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.lang.model.element.Element;
import javax.lang.model.element.PackageElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;

import static javax.lang.model.element.ElementKind.PACKAGE;

@SupportedAnnotationTypes({"org.jboss.errai.bus.server.annotations.Remote"})
public class RemoteTsExporter extends AbstractProcessor {

    private static ProcessingEnvironment staticPocessingEnv;

    @Override
    public synchronized void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        RemoteTsExporter.staticPocessingEnv = processingEnv;
    }

    public boolean process(final Set<? extends TypeElement> annotations, final RoundEnvironment roundEnv) {
        try {

            if (!Boolean.valueOf(System.getProperty("ts-export"))) {
                return false;
            }

            if (roundEnv.processingOver()) {
                return false;
            }

            annotations.stream()
                    .map(roundEnv::getElementsAnnotatedWith)
                    .flatMap(Collection::stream)
                    .forEach(this::generateTypeScriptFile);
        } catch (final Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    private void generateTypeScriptFile(final Element element) {

        if (!element.getKind().isInterface()) {
            System.out.println(element.getSimpleName() + "is not an Interface. That's not supported.");
            return;
        }

        if (!element.getEnclosingElement().getKind().equals(PACKAGE)) {
            System.out.println(element.getSimpleName() + "is probably an inner Class. That's not supported.");
            return;
        }

        System.out.println("Generating source for " + ((TypeElement) element).getQualifiedName().toString());
        final String source = new TsClass((TypeElement) element).toSource();

        final String targetDir = ((PackageElement) element.getEnclosingElement()).getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(("/tmp/" + targetDir + "/index.ts").replace("/", File.separator));
        System.out.println("Source generated. Saving to " + path.toString());

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), source.getBytes());
            System.out.println("Saved.");
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    private void writeSourceFile(final PackageElement _package, final String source) {

        final String targetDir = _package.getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(("/tmp/" + targetDir + "/index.ts").replace("/", File.separator));

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), source.getBytes());
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    private Path createFileIfNotExists(final Path path) throws IOException {
        if (!path.toFile().exists()) {
            return Files.createFile(path);
        } else {
            return path;
        }
    }

    public static Element getTypeElement(final Element e) {
        return getTypeElement(e.asType());
    }

    public static Element getTypeElement(final TypeMirror t) {
        switch (t.getKind()) {
            case TYPEVAR:
                return ((TypeVariable) t).asElement();
            default:
                return staticPocessingEnv.getTypeUtils().asElement(t);
        }
    }
}