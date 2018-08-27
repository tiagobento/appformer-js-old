package org.uberfire.jsbridge;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
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

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.ENUM;
import static javax.lang.model.element.ElementKind.ENUM_CONSTANT;
import static javax.lang.model.element.ElementKind.INTERFACE;
import static javax.lang.model.element.ElementKind.PACKAGE;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedAnnotationTypes({"org.jboss.errai.bus.server.annotations.Remote"})
public class RemoteTsExporter extends AbstractProcessor {

    public static ProcessingEnvironment staticProcessingEnv;
    public static Types types;
    public static Elements elements;
    public static String currentMavenModuleName;

    @Override
    public synchronized void init(final ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        RemoteTsExporter.staticProcessingEnv = processingEnv;
        RemoteTsExporter.types = processingEnv.getTypeUtils();
        RemoteTsExporter.elements = processingEnv.getElementUtils();
    }

    public boolean process(final Set<? extends TypeElement> annotations, final RoundEnvironment roundEnv) {
        try {

            if (!Boolean.getBoolean("ts-export")) {
                return false;
            }

            if (roundEnv.processingOver()) {
                return false;
            }

            annotations.stream()
                    .map(roundEnv::getElementsAnnotatedWith)
                    .flatMap(Collection::stream)
                    .forEach(this::generateTypeScriptFile);

            System.out.println("TypeScript files exported successfully.");
        } catch (final Exception e) {
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
        setCurrentModuleName(rpcCallerTsClass);
        generateRpcFile(rpcCallerTsClass);

        rpcCallerTsClass.getAllPojoDependencies().stream()
                .filter(distinctBy(PortablePojoModule::getVariableName))
                .forEach(this::generatePojoFile);
    }

    private void setCurrentModuleName(final RpcCallerTsClass tsClass) {
        try {
            final Field sourceFileField = tsClass.getInterface().getClass().getField("sourcefile");
            sourceFileField.setAccessible(true);
            final String[] sourceFileParts = sourceFileField.get(tsClass.getInterface()).toString().split("/src/main/java")[0].split("/");
            currentMavenModuleName = sourceFileParts[sourceFileParts.length - 1];
        } catch (final Exception e) {
            throw new RuntimeException("Error while reading [sourcefile] field from @Remote interface element.", e);
        }
    }

    private void generateRpcFile(final RpcCallerTsClass tsClass) {
        System.out.println("Generating source for " + tsClass.getInterface().getQualifiedName().toString());
        final String source = tsClass.toSource();

        final String targetDir = tsClass.getInterface().getQualifiedName().toString().replace(".", "/");
        final Path path = Paths.get(format("/tmp/ts-exporter/%s/%s.ts", currentMavenModuleName, targetDir).replace("/", File.separator));
        System.out.println("Source generated. Saving to " + path.toString());

        try {
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), source.getBytes());
            System.out.println("Saved.");
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    private void generatePojoFile(final PortablePojoModule portablePojoModule) {
        final String stringPath = portablePojoModule.getPath2();
        final Path path = Paths.get("/tmp/ts-exporter/" + stringPath + ".ts");
        if (Files.exists(path)) {
            System.out.println(format("Skipping generation of %s because it already exists", stringPath));
            return;
        }

        try {
            Files.createDirectories(path.getParent());
            Files.createFile(path);
            Files.write(path, pojoInterfaceToSource(portablePojoModule).getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String pojoInterfaceToSource(final PortablePojoModule portablePojoModule) {
        final ImportStore IMPORT_STORE = new ImportStore();

        final DeclaredType declaredType = portablePojoModule.getType();
        final TypeElement typeElement = (TypeElement) declaredType.asElement();

        final String fqcn = new JavaType(typeElement.asType(), typeElement.asType()).toUniqueTsType();
        final String simpleName = fqcn.substring(fqcn.indexOf(typeElement.getSimpleName().toString()));

        final List<JavaType> interfacesImplemented = typeElement.getInterfaces().stream()
                .map(t -> new JavaType(t, declaredType))
                .filter(t -> !t.getFlatFqcn().matches("^javax?.*"))
                .collect(toList());

        if (typeElement.getKind().equals(INTERFACE)) {

            final String _implements = interfacesImplemented.isEmpty()
                    ? ""
                    : "extends " + interfacesImplemented.stream().peek(IMPORT_STORE::importing).map(JavaType::toUniqueTsType).collect(joining(", "));


            IMPORT_STORE.getImports().forEach(this::generatePojoFile);
            
            return format("%s\n\nexport default interface %s %s {\n}", IMPORT_STORE.getImportStatements(), simpleName, _implements);
        }

        if (typeElement.getKind().equals(ENUM)) {
            //FIXME: Enum extending interfaces?
            final String enumFields = typeElement.getEnclosedElements().stream()
                    .filter(s -> s.getKind().equals(ENUM_CONSTANT))
                    .map(Element::getSimpleName)
                    .collect(joining(", "));

            return format("enum %s { %s }\n\nexport default %s;", simpleName, enumFields, simpleName);
        }

        final String fields = portablePojoModule.getType().asElement().getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .map(s -> format("  public readonly %s?: %s;", s.getSimpleName(), IMPORT_STORE.importing(new JavaType(s.asType(), declaredType)).toUniqueTsType()))
                .collect(joining("\n"));

        final String constructorArgs = getConstructorArgs(IMPORT_STORE, typeElement);

        final String superCall = typeElement.getSuperclass().toString().matches("^javax?.*")
                ? ""
                : "super({...self.inherited});";

        final String _implements = interfacesImplemented.isEmpty()
                ? format("implements Portable<%s>", simpleName)
                : "implements " + interfacesImplemented.stream().peek(IMPORT_STORE::importing).map(JavaType::toUniqueTsType).collect(joining(", ")) + format(", Portable<%s>", simpleName);

        final String _extends = typeElement.getSuperclass().toString().matches("^javax?.*")
                ? ""
                : "extends " + IMPORT_STORE.importing(new JavaType(typeElement.getSuperclass(), declaredType)).toUniqueTsType();

        final String hierarchy = _extends + " " + _implements;
        final String abstractOrNot = typeElement.getModifiers().contains(ABSTRACT) ? "abstract" : "";

        //Has to be the last 'cause that's where imports are done being added.
        final String imports = IMPORT_STORE.getImportStatements();

        IMPORT_STORE.getImports().forEach(this::generatePojoFile);

        return format("" +
                              "import { Portable } from \"generated/Model\";" +
                              "\n" +
                              "%s" +
                              "\n" +
                              "\n" +
                              "export default %s class %s %s {" +
                              "\n" +
                              "\n" +
                              "  protected readonly _fqcn: string = \"%s\";" +
                              "\n" +
                              "\n" +
                              "%s" +
                              "\n" +
                              "\n" +
                              "  constructor(self: { %s }) {" +
                              "\n" +
                              "    %s" +
                              "\n" +
                              "    Object.assign(this, self); " +
                              "\n" +
                              "  }" +
                              "\n" +
                              "}",

                      imports,
                      abstractOrNot,
                      simpleName,
                      hierarchy,
                      portablePojoModule.getOriginatingFqcn(),
                      fields,
                      constructorArgs,
                      superCall
        );

    }

    private String getConstructorArgs(final ImportStore dependencies, final TypeElement typeElement) {

        final List<String> fields = typeElement.getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .map(s -> format("%s?: %s", s.getSimpleName(), dependencies.importing(new JavaType(s.asType(), typeElement.asType())).toUniqueTsType()))
                .collect(toList());

        return Stream.concat(fields.stream(),
                             typeElement.getSuperclass().toString().equals("java.lang.Object")
                                     ? Stream.empty()
                                     : Stream.of("inherited?: {" + getConstructorArgs(dependencies, (TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement()) + "}"))
                .collect(joining(", "));
    }

    private Path createFileIfNotExists(final Path path) throws IOException {
        return path.toFile().exists() ? path : Files.createFile(path);
    }

    public static <T> Predicate<T> distinctBy(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }
}