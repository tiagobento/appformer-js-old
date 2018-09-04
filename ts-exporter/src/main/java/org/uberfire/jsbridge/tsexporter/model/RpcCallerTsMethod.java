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

import javax.lang.model.element.TypeElement;

import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.hierarchy.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
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
        return format(lines("",
                            "public %s(args: { %s }) {",
                            "  return rpc(%s, [%s])",
                            "         .then((json: string) => { ",
                            "           return unmarshall(json, {%s}) as %s; ",
                            "         }); ",
                            "}",
                            ""),

                      methodDeclaration(),
                      params(),
                      erraiBusPath(),
                      rpcCallParams(),
                      factoriesOracle(),
                      returnType());
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
        //TODO: discover whole dependency/hierarchy tree of return type.
        return "";
    }

    private String returnType() {
        return importing(javaMethod.getReturnType(), TYPE_ARGUMENT_USE).toTypeScript();
    }

    private TranslatableJavaType importing(final JavaType javaType, final JavaType.TsTypeTarget tsTypeTarget) {
        javaType.translate(tsTypeTarget).getDependencies().forEach(t -> dependencyGraph.add(t.asElement()));
        return importStore.with(javaType.translate(tsTypeTarget));
    }
}
