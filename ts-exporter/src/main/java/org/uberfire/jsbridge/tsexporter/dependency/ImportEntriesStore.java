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

package org.uberfire.jsbridge.tsexporter.dependency;

import java.util.Set;

import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.meta.translatable.Translatable;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.util.IndirectHashMap;
import org.uberfire.jsbridge.tsexporter.util.Utils;

import static java.lang.String.format;
import static java.util.Collections.singleton;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toSet;

public class ImportEntriesStore {

    private final IndirectHashMap<ImportEntry, Set<DependencyRelation.Kind>> dependencies;

    public ImportEntriesStore() {
        this.dependencies = new IndirectHashMap<>(ImportEntry::relativePath);
    }

    public Translatable with(final DependencyRelation.Kind kind,
                             final Translatable type) {

        type.getAggregatedImportEntries().forEach(e -> dependencies.merge(e, singleton(kind), Utils::mergeSets));
        return type;
    }

    public String getImportStatements(final TsClass tsClass) {
        return getImports(tsClass).stream()
                .map(relation -> toTypeScriptImportSource(relation.getImportEntry(), tsClass.getType()))
                .sorted()
                .collect(joining("\n"));
    }

    public Set<DependencyRelation> getImports(final TsClass tsClass) {
        return dependencies.entrySet().stream()
                .filter(e -> !e.getKey().represents(tsClass.getType()))
                .map(e -> new DependencyRelation(e.getKey(), e.getValue()))
                .collect(toSet());
    }

    private String toTypeScriptImportSource(final ImportEntry dependency,
                                            final DeclaredType owner) {

        return format("import %s from '%s';", dependency.uniqueName(owner), dependency.sourcePath());
    }
}
