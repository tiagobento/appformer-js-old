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

import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;
import org.uberfire.jsbridge.tsexporter.meta.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.meta.dependency.ImportStore;

import static java.lang.String.format;
import static java.util.Collections.singleton;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static javax.lang.model.element.ElementKind.CLASS;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;

public class RpcCallerTsMethod {

    private final ExecutableElement executableElement;
    private final TypeElement typeElement;
    private final ImportStore importStore;
    private final String name;
    private final DependencyGraph dependencyGraph;
    private final DecoratorStore decoratorStore;

    public RpcCallerTsMethod(final RpcCallerTsMethod tsMethod,
                             final String name) {

        this.typeElement = tsMethod.typeElement;
        this.executableElement = tsMethod.executableElement;
        this.importStore = tsMethod.importStore;
        this.dependencyGraph = tsMethod.dependencyGraph;
        this.decoratorStore = tsMethod.decoratorStore;
        this.name = name;
    }

    public RpcCallerTsMethod(final ExecutableElement executableElement,
                             final TypeElement typeElement,
                             final ImportStore importStore,
                             final DependencyGraph dependencyGraph,
                             final DecoratorStore decoratorStore) {

        this.executableElement = executableElement;
        this.typeElement = typeElement;
        this.importStore = importStore;
        this.name = executableElement.getSimpleName().toString();
        this.dependencyGraph = dependencyGraph;
        this.decoratorStore = decoratorStore;
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
                            "           return unmarshall(json, {",
                            "%s",
                            "           }) as %s;",
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

    private String methodDeclaration() {
        return name + importing(new JavaType(executableElement.asType(), typeElement.asType()), TYPE_ARGUMENT_DECLARATION, DecoratorStore.EMPTY).toTypeScript();
    }

    private String params() {
        return getParameterJavaTypesByNames().entrySet().stream()
                .map(e -> format("%s: %s", e.getKey(), importing(e.getValue(), TYPE_ARGUMENT_USE, DecoratorStore.EMPTY).toTypeScript()))
                .collect(joining(", "));
    }

    private String erraiBusString() {
        return '"' +
                typeElement.getQualifiedName().toString() +
                "|" +
                executableElement.getSimpleName() +
                ":" +
                executableElement.getParameters().stream()
                        .map(Element::asType)
                        .map(s -> Optional.ofNullable(types.asElement(s)))
                        .filter(Optional::isPresent).map(Optional::get)
                        .map(Object::toString)
                        .collect(toList()).stream().collect(joining(":")) +
                '"';
    }

    private String rpcCallParams() {
        return getParameterJavaTypesByNames().entrySet().stream()
                .map(param -> format("marshall(%s)", "args." + param.getKey()))
                .collect(joining(", "));
    }

    private String factoriesOracle() {
        final Set<Element> allDependencies = dependencyGraph.findAllDependencies(singleton(getReturnTypeJavaType().asElement())).stream()
                .map(DependencyGraph.Vertex::getElement)
                .collect(toSet());

        return dependencyGraph.findAllDependents(allDependencies).stream()
                .map(DependencyGraph.Vertex::getPojoClass)
                .sorted(comparing(TsClass::getRelativePath))
                .filter(dependent -> allDependencies.stream().anyMatch(d -> types.isSubtype(types.erasure(dependent.getType()), types.erasure(d.asType()))))
                .filter(dependent -> dependent.getType().asElement().getKind().equals(CLASS) && !dependent.getType().asElement().getModifiers().contains(ABSTRACT))
                .distinct()
                .map(c -> format("\"%s\": (x: any) => new %s(x)",
                                 c.asElement().getQualifiedName().toString(),
                                 importing(new JavaType(types.erasure(c.getType()), typeElement.asType()), TYPE_ARGUMENT_USE, decoratorStore).toTypeScript()))
                .collect(joining(",\n"));
    }

    private String returnType() {
        return importing(getReturnTypeJavaType(), TYPE_ARGUMENT_USE, decoratorStore).toTypeScript();
    }

    private JavaType getReturnTypeJavaType() {
        return new JavaType(executableElement.getReturnType(), typeElement.asType());
    }

    private JavaType.Translatable importing(final JavaType javaType,
                                            final TsTypeTarget tsTypeTarget,
                                            final DecoratorStore decoratorStore) {

        final JavaType.Translatable translatable = javaType.translate(tsTypeTarget, decoratorStore);
        translatable.getAggregated().forEach(dependencyGraph::add);
        return importStore.with(translatable);
    }

    private LinkedHashMap<String, JavaType> getParameterJavaTypesByNames() {
        return this.executableElement.getParameters().stream().collect(
                toMap(arg -> arg.getSimpleName().toString(),
                      arg -> new JavaType(arg.asType(), typeElement.asType()),
                      (a, b) -> b, //default map behavior
                      LinkedHashMap::new)); //order is important!
    }
}
