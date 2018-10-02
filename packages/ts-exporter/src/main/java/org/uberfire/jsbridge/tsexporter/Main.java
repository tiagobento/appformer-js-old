package org.uberfire.jsbridge.tsexporter;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.Filer;
import javax.annotation.processing.Messager;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;

import org.uberfire.jsbridge.tsexporter.config.Configuration;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;

import static java.lang.System.currentTimeMillis;
import static java.lang.System.getProperty;
import static java.util.Arrays.asList;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static javax.tools.Diagnostic.Kind.ERROR;
import static javax.tools.StandardLocation.CLASS_OUTPUT;
import static org.uberfire.jsbridge.tsexporter.Main.ENTRY_POINT;
import static org.uberfire.jsbridge.tsexporter.Main.PORTABLE;
import static org.uberfire.jsbridge.tsexporter.Main.REMOTE;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({REMOTE, PORTABLE, ENTRY_POINT})
public class Main extends AbstractProcessor {

    static final String REMOTE = "org.jboss.errai.bus.server.annotations.Remote";
    static final String PORTABLE = "org.jboss.errai.common.client.api.annotations.Portable";
    static final String ENTRY_POINT = "org.jboss.errai.ioc.client.api.EntryPoint";
    static final String TS_EXPORTER_PACKAGE = "org.appformer.tsexporter.exports";

    public static Types types;
    public static Elements elements;
    public static Messager messager;
    public static Filer filer;

    private static final List<Element> seenPortableTypes = new ArrayList<>();
    private static final List<Element> seenRemoteInterfaces = new ArrayList<>();

    @Override
    public synchronized void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        Main.types = processingEnv.getTypeUtils();
        Main.elements = processingEnv.getElementUtils();
        Main.messager = processingEnv.getMessager();
        Main.filer = processingEnv.getFiler();
    }

    @Override
    public boolean process(final Set<? extends TypeElement> annotations,
                           final RoundEnvironment roundEnv) {

        if (!asList("none", "all", "single").contains(getProperty("ts-exporter"))) {
            System.out.println("TypeScript exporter is not activated.");
            return false;
        }

        try {
            process(roundEnv, annotations.stream().collect(toMap(identity(), roundEnv::getElementsAnnotatedWith)));
            return false;
        } catch (final Exception e) {
            e.printStackTrace();
            processingEnv.getMessager().printMessage(ERROR, "Error on TypeScript exporter.");
            return false;
        }
    }

    private void process(final RoundEnvironment roundEnv,
                         final Map<TypeElement, Set<? extends Element>> typesByAnnotations) {

        if (!roundEnv.processingOver() && !roundEnv.errorRaised()) {
            typesByAnnotations.forEach((annotation, classes) -> {
                if (REMOTE.equals(annotation.getQualifiedName().toString())) {
                    seenRemoteInterfaces.addAll(classes);
                } else if (PORTABLE.equals(annotation.getQualifiedName().toString())) {
                    seenPortableTypes.addAll(classes);
                } else if (ENTRY_POINT.equals(annotation.getQualifiedName().toString())) {
                    System.out.println("EntryPoint detected.");
                } else {
                    throw new RuntimeException("Unsupported annotation type.");
                }
            });
        } else {
            writeExportFile(seenPortableTypes, "portables.tsexporter");
            writeExportFile(seenRemoteInterfaces, "remotes.tsexporter");

            switch (getProperty("ts-exporter")) {
                case "single": {
                    throw new RuntimeException("Exporting single modules is not supported yet.");
                }

                case "portables-only": {
                    throw new RuntimeException("Exporting portables only is not supported yet.");
                }

                case "all": {
                    final long start = currentTimeMillis();
                    System.out.println("Generating all TypeScript npm packages...");

                    final String version = "1.0.0"; //TODO: Read from System property or something
                    final Configuration config = new Configuration();
                    final TsCodegenResult result = new TsCodegen(version, new DecoratorStore(config)).generate();

                    final TsCodegenWriter writer = new TsCodegenWriter(config, result);
                    writer.write();

                    final TsCodegenBuilder builder = new TsCodegenBuilder(writer.getOutputDir());
                    builder.build();

                    final TsCodegenLibBundler bundler = new TsCodegenLibBundler(config, writer);
                    bundler.bundle();

                    System.out.println("TypeScript exporter has successfully run. (" + (currentTimeMillis() - start) + "ms)");
                    break;
                }

                default:
                    System.out.println("TypeScript exporter will not run because ts-exporter-generate property is not set.");
                    break;
            }
        }
    }

    private void writeExportFile(final List<Element> elements,
                                 final String fileName) {

        final String contents = elements.stream()
                .map(element -> ((TypeElement) element).getQualifiedName().toString())
                .distinct()
                .collect(joining("\n"));

        try (final Writer writer = filer.createResource(CLASS_OUTPUT, TS_EXPORTER_PACKAGE, fileName).openWriter()) {
            System.out.println("Saving export file: " + fileName + "... ");
            writer.write(contents);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }
}