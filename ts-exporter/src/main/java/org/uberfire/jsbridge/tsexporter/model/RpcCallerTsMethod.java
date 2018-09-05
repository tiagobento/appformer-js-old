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

import java.util.Set;

import javax.lang.model.element.Element;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.Main;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.hierarchy.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.Utils.lines;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;

public class RpcCallerTsMethod {

    private final TypeElement _interface;
    private final ImportStore importStore;
    private final RpcJavaMethod javaMethod;
    private final String name;
    private final DependencyGraph dependencyGraph;

    public RpcCallerTsMethod(final RpcCallerTsMethod tsMethod,
                             final String name) {

        this._interface = tsMethod._interface;
        this.javaMethod = tsMethod.javaMethod;
        this.importStore = tsMethod.importStore;
        this.dependencyGraph = tsMethod.dependencyGraph;
        this.name = name;
    }

    public RpcCallerTsMethod(final TypeElement _interface,
                             final ImportStore importStore,
                             final RpcJavaMethod javaMethod,
                             final DependencyGraph dependencyGraph) {

        this._interface = _interface;
        this.importStore = importStore;
        this.javaMethod = javaMethod;
        this.name = javaMethod.getName();
        this.dependencyGraph = dependencyGraph;
    }

    public String getName() {
        return name;
    }

    public String toSource() {
        final String name = methodDeclaration();
        final String params = params();
        final String erraiBusString = erraiBusPath();
        final String rpcCallParams = rpcCallParams();
        final String returnType = returnType();

        final String factoriesOracle = factoriesOracle(); //Has to be the last

        return format(lines("",
                            "public %s(args: { %s }) {",
                            "  return rpc(%s, [%s])",
                            "         .then((json: string) => { ",
                            "           return unmarshall(json, {",
                            "%s",
                            "           }) as %s; ",
                            "         }); ",
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
        return name + importing(new JavaType(javaMethod.getType(), _interface.asType()), TYPE_ARGUMENT_DECLARATION).toTypeScript();
    }

    private String params() {
        return javaMethod.getParameterJavaTypesByNames().entrySet().stream()
                .map(e -> format("%s: %s", e.getKey(), importing(e.getValue(), TYPE_ARGUMENT_USE).toTypeScript()))
                .collect(joining(", "));
    }

    private String erraiBusPath() {
        return '"' + _interface.getQualifiedName().toString() + "|" + javaMethod.toErraiBusPath() + '"';
    }

    private String rpcCallParams() {
        return javaMethod.getParameterJavaTypesByNames().entrySet().stream()
                .map(param -> format("marshall(%s)", "args." + param.getKey()))
                .collect(joining(", "));
    }

    private String factoriesOracle() {
        final Element element = Main.types.asElement(javaMethod.getReturnType().getType());
        final Set<Element> allDependencies = dependencyGraph.findAllDependencies(element).stream()
                .map(DependencyGraph.Vertex::getElement)
                .collect(toSet());

        return dependencyGraph.findAllDependents(allDependencies).stream()
                .map(DependencyGraph.Vertex::getPojoClass)
                .filter(dependent -> allDependencies.stream().anyMatch(d -> Main.types.isSubtype(dependent.getType(), d.asType())))
                .filter(s -> isConcrete(s.getType()))
                .distinct()
                .map(c -> format("\"%s\": (x: any) => new %s(x)",
                                 c.getElement().getQualifiedName().toString(),
                                 importing(new JavaType(Main.types.erasure(c.getType())), TYPE_ARGUMENT_USE).toTypeScript()))
                .collect(joining(",\n"));
    }

    private boolean isConcrete(final DeclaredType type) {
        return type.asElement().getKind().isClass() && !type.asElement().getModifiers().contains(Modifier.ABSTRACT);
    }

    private String returnType() {
        return importing(javaMethod.getReturnType(), TYPE_ARGUMENT_USE).toTypeScript();
    }

    private TranslatableJavaType importing(final JavaType javaType,
                                           final JavaType.TsTypeTarget tsTypeTarget) {

        final TranslatableJavaType translatable = javaType.translate(tsTypeTarget);
        translatable.getDependencies().forEach(t -> dependencyGraph.add(t.asElement()));
        return importStore.with(translatable);
    }
}
