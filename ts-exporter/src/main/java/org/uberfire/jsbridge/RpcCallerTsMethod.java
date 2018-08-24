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

package org.uberfire.jsbridge;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.lang.model.element.TypeElement;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.RemoteTsExporter.currentMavenModuleName;

public class RpcCallerTsMethod {

    private final TypeElement _interface;
    private final RemoteInterfaceJavaMethod method;
    private final String name;
    private final Map<String, String> parameterFqcnsByName;

    public RpcCallerTsMethod(final RpcCallerTsMethod tsMethod,
                             final String name) {

        this._interface = tsMethod._interface;
        this.method = tsMethod.method;
        this.parameterFqcnsByName = tsMethod.method.getParameterFqcnsByName();
        this.name = name;
    }

    public RpcCallerTsMethod(final TypeElement _interface,
                             final RemoteInterfaceJavaMethod javaMethod) {

        this._interface = _interface;
        this.method = javaMethod;
        this.name = javaMethod.getName();
        this.parameterFqcnsByName = method.getParameterFqcnsByName();
    }

    public String toSource() {
        System.out.println("Generating " + method.getName() + " for " + _interface.getQualifiedName().toString());
        return format("public %s(args: { %s }) { return rpc(%s, [%s]).then((json: string) => unmarshall(json, {%s}) as %s); }",
                      getName(), params(), erraiBusPath(), rpcCallParams(), factoriesOracle(), returnType());
    }

    private String returnType() {
        return toTsType(method.getReturnTypeFqcn());
    }

    private String factoriesOracle() {
        return method.getAllDependenciesOfReturnType().stream()
                .collect(toMap(fqcn -> fqcn, this::extractPortablePojoModuleName))
                .entrySet().stream()
                .map(e -> e.getValue().map(module -> oracleEntrySource(module.getVariableName(), e.getKey())))
                .filter(Optional::isPresent).map(Optional::get)
                .collect(joining(",\n"));
    }

    private String oracleEntrySource(final String variableName, final String moduleName) {
        return format("\"%s\": (x: any) => new %s(x)", moduleName, variableName);
    }

    public Set<PortablePojoModule> getAllDependencies() {
        return Stream.concat(method.getDirectParameterDependencies().stream(), method.getAllDependenciesOfReturnType().stream())
                .flatMap(fqcn -> extractPortablePojoModuleName(fqcn).map(Stream::of).orElse(Stream.of()))
                .collect(toSet());
    }

    private Optional<PortablePojoModule> extractPortablePojoModuleName(final String fqcn) {
        try {
            final Class<?> clazz = Class.forName(fqcn);
            if (clazz.getPackage().getName().startsWith("java")) {
                return Optional.empty();
            }

            final String path = clazz.getResource('/' + clazz.getName().replace('.', '/') + ".class").toString();

            //Nice RegEx explanation:
            //1. Begin with a slash => (/)
            //2. Followed by a sequence containing letters or dashes => [\\w-]+ (the plus sign indicates that this sequence must have at least one character.)
            //3. Followed by a single dash => (-)
            //4. Followed by a sequence of digits and dots => [\\d.]+ (notice the plus sign!)
            //5. Followed by pretty much anything => (.*)
            //6. Followed by ".jar!" => \\.jar!
            final String[] split = path.split("(/)[\\w-]+(-)[\\d.]+(.*)\\.jar!")[0].split("/");

            return Optional.of(new PortablePojoModule(fqcn, split[split.length - 2]));
        } catch (final ClassNotFoundException e) {
            return Optional.of(new PortablePojoModule(fqcn, currentMavenModuleName));
        }
    }

    public String getName() {
        return name;
    }

    private String params() {
        return parameterFqcnsByName.entrySet().stream()
                .map(e -> format("%s: %s", e.getKey(), toTsType(e.getValue())))
                .collect(joining(", "));
    }

    private String toTsType(final String fqcn) {
        //TODO: Add other java lang classes
        switch (fqcn) {
            case "any":
                return "any";
            case "java.lang.String":
                return "string";
            case "java.util.List":
                return "any[]"; //FIXME: Return actual List type
            case "java.util.Set":
                return "any[]"; //FIXME: Return actual Set type
            default:
                return extractPortablePojoModuleName(fqcn).get().getVariableName();
        }
    }

    private String rpcCallParams() {
        return parameterFqcnsByName.entrySet().stream()
                .map(param -> format("marshall(%s)", "args." + param.getKey()))
                .collect(joining(", "));
    }

    private String erraiBusPath() {
        return '"' + _interface.getQualifiedName().toString() + "|" + method.toErraiBusPath() + '"';
    }
}
