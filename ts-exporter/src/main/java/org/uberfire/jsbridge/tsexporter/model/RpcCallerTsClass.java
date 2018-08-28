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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;

import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;
import org.uberfire.jsbridge.tsexporter.util.Lazy;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.METHOD;
import static org.uberfire.jsbridge.tsexporter.Main.types;

public class RpcCallerTsClass {

    private final TypeElement _interface;
    private final Lazy<List<RpcCallerTsMethod>> tsMethods;
    private final ImportStore importStore;

    private static final List<String> RESERVED_WORDS = Arrays.asList("delete", "copy");

    public RpcCallerTsClass(final TypeElement _interface) {
        this._interface = _interface;
        this.tsMethods = new Lazy<>(this::initAllTsMethods);
        this.importStore = new ImportStore();
    }

    private List<RpcCallerTsMethod> initAllTsMethods() {
        return getAllJavaMethods(_interface).stream()
                .map(javaMethod -> new RpcCallerTsMethod(_interface, importStore, javaMethod))
                .collect(toList());
    }

    private List<RpcJavaMethod> getJavaMethods(final TypeElement _interface) {
        return _interface.getEnclosedElements().stream()
                .filter(member -> member.getKind().equals(METHOD))
                .map(member -> new RpcJavaMethod(this._interface, (ExecutableElement) member))
                .collect(toList());
    }

    //TODO: Use elements.getAllMembers
    private List<RpcJavaMethod> getAllJavaMethods(final TypeElement _interface) {
        final List<RpcJavaMethod> methods = new ArrayList<>();

        methods.addAll(getJavaMethods(_interface));
        methods.addAll(_interface.getInterfaces().stream()
                               .flatMap(iface -> getAllJavaMethods((TypeElement) types.asElement(iface)).stream())
                               .collect(toList()));

        return methods;
    }

    public String toSource() {

        final String methods = methods();
        final String simpleName = simpleName();

        //Has to be the last
        final String imports = imports();

        return format("" +
                              "import {rpc, marshall, unmarshall} from \"appformer/API\";\n" +
                              "%s" +
                              "\n\n" +
                              "export default class %s {\n" +
                              "%s" +
                              "\n" +
                              "}" +
                              "\n",

                      imports,
                      simpleName,
                      methods
        );
    }

    private String simpleName() {
        return _interface.getSimpleName().toString();
    }

    private String methods() {
        return tsMethods.get().stream()
                .collect(groupingBy(RpcCallerTsMethod::getName)).entrySet().stream()
                .flatMap(e -> resolveOverloadsAndReservedWords(e.getKey(), e.getValue()).stream())
                .map(RpcCallerTsMethod::toSource)
                .collect(joining("\n"));
    }

    private String imports() {
        return importStore.getImportStatements();
    }

    public List<ImportableTsType> getDependencies() {
        return importStore.getImports();
    }

    private List<RpcCallerTsMethod> resolveOverloadsAndReservedWords(final String name,
                                                                     final List<RpcCallerTsMethod> methods) {

        if (methods.size() <= 1 && !RESERVED_WORDS.contains(name)) {
            return methods;
        }

        final AtomicInteger i = new AtomicInteger(0);
        return methods.stream()
                .map(tsMethod -> new RpcCallerTsMethod(tsMethod, tsMethod.getName() + i.getAndIncrement()))
                .collect(toList());
    }

    public TypeElement getInterface() {
        return _interface;
    }


}
