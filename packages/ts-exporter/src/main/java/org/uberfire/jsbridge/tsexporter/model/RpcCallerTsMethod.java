/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.uberfire.jsbridge.tsexporter.model;

import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;

import com.sun.tools.javac.code.Symbol;
import org.uberfire.jsbridge.tsexporter.Main;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntriesStore;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntry;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.Translatable;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaNumberWithDefaultInstantiation;

import static java.lang.String.format;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static javax.lang.model.element.ElementKind.CLASS;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.NO_DECORATORS;
import static org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation.Kind.CODE;
import static org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation.Kind.FIELD;
import static org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation.Kind.HIERARCHY;
import static org.uberfire.jsbridge.tsexporter.meta.Translatable.SourceUsage.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.Translatable.SourceUsage.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class RpcCallerTsMethod {

    private final ExecutableElement executableElement;
    private final TypeElement owner;
    private final ImportEntriesStore importStore;
    private final String name;
    private final DependencyGraph dependencyGraph;
    private final DecoratorStore decoratorStore;

    RpcCallerTsMethod(final RpcCallerTsMethod tsMethod,
                      final String name) {

        this.owner = tsMethod.owner;
        this.executableElement = tsMethod.executableElement;
        this.importStore = tsMethod.importStore;
        this.dependencyGraph = tsMethod.dependencyGraph;
        this.decoratorStore = tsMethod.decoratorStore;
        this.name = name;
    }

    RpcCallerTsMethod(final ExecutableElement executableElement,
                      final RpcCallerTsClass rpcCallerTsClass) {

        this.executableElement = executableElement;
        this.name = executableElement.getSimpleName().toString();
        this.owner = rpcCallerTsClass.asElement();
        this.importStore = rpcCallerTsClass.importEntriesStore;
        this.dependencyGraph = rpcCallerTsClass.dependencyGraph;
        this.decoratorStore = rpcCallerTsClass.decoratorStore;
    }

    public String getName() {
        return name;
    }

    public String toSource() {
        final String name = methodDeclaration();
        final String params = params();
        final String erraiBusString = erraiBusString();
        final String rpcCallParams = rpcCallParams();
        final String returnType = returnType();

        final String factoriesOracle = factoriesOracle(); //Has to be the last

        return format(lines("",
                            "public %s(args: { %s }) {",
                            "  return rpc(%s, [%s])",
                            "         .then((json: string) => {",
                            "           return unmarshall(json, new Map([",
                            "%s",
                            "           ])) as %s;",
                            "         });",
                            "}",
                            ""),

                      name,
                      params,
                      erraiBusString,
                      rpcCallParams,
                      factoriesOracle,
                      returnType);
    }

    private String returnType() {
        return importing(translatedReturnType()).toTypeScript(TYPE_ARGUMENT_USE);
    }

    private String methodDeclaration() {
        final JavaType methodType = new JavaType(executableElement.asType(), owner.asType());
        return name + importing(methodType.translate(NO_DECORATORS)).toTypeScript(TYPE_ARGUMENT_DECLARATION);
    }

    private String params() {
        return getParameterJavaTypesByNames().entrySet().stream()
                .map(e -> format("%s: %s", e.getKey(), importing(e.getValue().translate(NO_DECORATORS)).toTypeScript(TYPE_ARGUMENT_USE)))
                .collect(joining(", "));
    }

    private String erraiBusString() {
        return '"' +
                owner.getQualifiedName().toString() +
                "|" +
                executableElement.getSimpleName() +
                ":" +
                executableElement.getParameters().stream()
                        .map(Element::asType)
                        .map(s -> Optional.ofNullable(types.asElement(s)))
                        .filter(Optional::isPresent).map(Optional::get)
                        .map(element -> element.toString() + ":") //FIXME: This is probably not 100% right
                        .collect(joining("")) +
                '"';
    }

    private String rpcCallParams() {
        return getParameterJavaTypesByNames().entrySet().stream()
                .map(param -> format("marshall(%s)", "args." + param.getKey()))
                .collect(joining(", "));
    }

    private String factoriesOracle() {

        final Set<Element> aggregatedTypesOfReturnType = translatedReturnType().getAggregatedImportEntries().stream()
                .map(ImportEntry::asElement)
                .collect(toSet());

        final Set<Element> childrenOfReturnType = dependencyGraph.findAllDependents(aggregatedTypesOfReturnType, HIERARCHY).stream()
                .map(DependencyGraph.Vertex::asElement)
                .collect(toSet());

        final Set<Element> allDependenciesElements = dependencyGraph.findAllDependencies(childrenOfReturnType, FIELD).stream()
                .map(DependencyGraph.Vertex::asElement)
                .collect(toSet());

        return dependencyGraph.findAllDependents(allDependenciesElements, HIERARCHY).stream()
                .map(DependencyGraph.Vertex::getPojoClass)
                .sorted(comparing(TsClass::getRelativePath))
                .filter(this::isConcreteClass)
                .filter(dependent -> allDependenciesElements.stream().anyMatch(element -> isSubtype(dependent, element)))
                .distinct()
                .map(this::toFactoriesOracleEntry)
                .collect(joining(",\n"));
    }

    private String toFactoriesOracleEntry(final PojoTsClass tsClass) {
        final JavaType javaType = new JavaType(types.erasure(tsClass.getType()), owner.asType());
        final String defaultNumbersInitialization = Main.elements.getAllMembers((TypeElement) javaType.asElement()).stream()
                .filter(e -> e.getKind().isField())
                .filter(e -> !e.getModifiers().contains(STATIC))
                .filter(e -> !e.asType().toString().contains("java.util.function"))
                .flatMap(field -> toOracleFactoryMethodConstructorEntry(field, new JavaType(field.asType(), javaType.getType())))
                .collect(joining(", "));

        return format("[\"%s\", () => new %s({ %s }) as any]",
                      ((Symbol) tsClass.asElement()).flatName().toString(),
                      importing(javaType.translate(decoratorStore)).toTypeScript(TYPE_ARGUMENT_USE),
                      defaultNumbersInitialization);
    }

    private Stream<String> toOracleFactoryMethodConstructorEntry(final Element fieldElement,
                                                                 final JavaType fieldJavaType) {

        final Translatable translatedFieldType = fieldJavaType.translate(decoratorStore);
        if (!(translatedFieldType instanceof TranslatableJavaNumberWithDefaultInstantiation)) {
            return Stream.empty();
        }

        final String fieldType = importStore.with(CODE, translatedFieldType).toTypeScript(TYPE_ARGUMENT_USE);
        return Stream.of(format("%s: new %s(\"0\")", fieldElement.getSimpleName(), fieldType));
    }

    private boolean isConcreteClass(final PojoTsClass tsClass) {
        return tsClass.asElement().getKind().equals(CLASS) &&
                !tsClass.asElement().getModifiers().contains(ABSTRACT);
    }

    private boolean isSubtype(final PojoTsClass tsClass, final Element element) {
        return types.isSubtype(types.erasure(tsClass.getType()), types.erasure(element.asType()));
    }

    private Translatable translatedReturnType() {
        return new JavaType(executableElement.getReturnType(), owner.asType()).translate(decoratorStore);
    }

    private Translatable importing(final Translatable translatable) {
        translatable.getAggregatedImportEntries().stream()
                .map(ImportEntry::asElement)
                .forEach(dependencyGraph::add);

        return importStore.with(CODE, translatable);
    }

    private LinkedHashMap<String, JavaType> getParameterJavaTypesByNames() {
        return this.executableElement.getParameters().stream().collect(
                toMap(arg -> arg.getSimpleName().toString(),
                      arg -> new JavaType(arg.asType(), owner.asType()),
                      (a, b) -> b, //default map behavior
                      LinkedHashMap::new)); //order is important!
    }
}
