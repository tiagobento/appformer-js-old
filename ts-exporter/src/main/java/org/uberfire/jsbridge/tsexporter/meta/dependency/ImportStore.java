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

package org.uberfire.jsbridge.tsexporter.meta.dependency;

import java.util.HashSet;
import java.util.Set;

import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.util.Utils.distinctBy;

public class ImportStore {

    private final Set<Dependency> dependencies = new HashSet<>();

    public JavaType.Translatable with(final JavaType.Translatable type) {
        dependencies.addAll(type.getAggregated());
        return type;
    }

    public String getImportStatements(final TsClass tsClass) {
        return getImports(tsClass).stream()
                .map(declaredType -> toTypeScriptImportSource(declaredType, tsClass.getType()))
                .sorted()
                .collect(joining("\n"));
    }

    public Set<Dependency> getImports(final TsClass tsClass) {
        return dependencies.stream()
                .filter(distinctBy(Dependency::sourcePath))
                .filter(dependency -> !dependency.represents(tsClass.getType()))
                .collect(toSet());
    }

    private String toTypeScriptImportSource(final Dependency dependency, final DeclaredType owner) {
        return format("import %s from '%s';", dependency.uniqueName(owner), dependency.sourcePath());
    }
}
