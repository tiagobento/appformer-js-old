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

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.meta.dependency.ImportStore;
import org.uberfire.jsbridge.tsexporter.util.Lazy;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.METHOD;
import static org.uberfire.jsbridge.tsexporter.Main.elements;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.NO_DECORATORS;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.dependency.Dependency.Kind.HIERARCHY;
import static org.uberfire.jsbridge.tsexporter.util.Utils.formatRightToLeft;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class RpcCallerTsClass implements TsClass {

    private final TypeElement typeElement;
    private final DependencyGraph dependencyGraph;
    private final DecoratorStore decoratorStore;
    private final ImportStore importStore;
    private final Lazy<String> source;

    private static final List<String> RESERVED_WORDS = Arrays.asList("delete", "copy");

    public RpcCallerTsClass(final TypeElement typeElement,
                            final DependencyGraph dependencyGraph,
                            final DecoratorStore decoratorStore) {

        this.typeElement = typeElement;
        this.dependencyGraph = dependencyGraph;
        this.decoratorStore = decoratorStore;
        this.importStore = new ImportStore();
        this.source = new Lazy<>(() -> formatRightToLeft(
                lines("",
                      "import {rpc, marshall, unmarshall} from 'appformer/API';",
                      "%s",
                      "",
                      "export default class %s {",
                      "%s",
                      "}"),

                this::imports,
                this::simpleName,
                this::methods
        ));
    }

    @Override
    public String toSource() {
        return source.get();
    }

    private String simpleName() {
        return importStore.with(HIERARCHY, new JavaType(typeElement.asType(), typeElement.asType()).translate(TYPE_ARGUMENT_DECLARATION, NO_DECORATORS)).toTypeScript();
    }

    private String methods() {
        return elements.getAllMembers(typeElement).stream()
                .filter(member -> member.getKind().equals(METHOD))
                .filter(member -> !member.getEnclosingElement().toString().equals("java.lang.Object"))
                .map(member -> new RpcCallerTsMethod((ExecutableElement) member, typeElement, importStore, dependencyGraph, decoratorStore))
                .collect(groupingBy(RpcCallerTsMethod::getName)).entrySet().stream()
                .flatMap(e -> resolveOverloadsAndReservedWords(e.getKey(), e.getValue()).stream())
                .map(RpcCallerTsMethod::toSource)
                .collect(joining("\n"));
    }

    private String imports() {
        return importStore.getImportStatements(this);
    }

    private List<RpcCallerTsMethod> resolveOverloadsAndReservedWords(final String name,
                                                                     final List<RpcCallerTsMethod> methodsWithTheSameName) {

        if (methodsWithTheSameName.size() <= 1 && !RESERVED_WORDS.contains(name)) {
            return methodsWithTheSameName;
        }

        final AtomicInteger i = new AtomicInteger(0);
        return methodsWithTheSameName.stream()
                .map(tsMethod -> new RpcCallerTsMethod(tsMethod, tsMethod.getName() + i.getAndIncrement()))
                .collect(toList());
    }

    @Override
    public Set<ImportStore.DependencyRelation> getDependencies() {
        source.get();
        return importStore.getImports(this);
    }

    @Override
    public DeclaredType getType() {
        return (DeclaredType) typeElement.asType();
    }
}
