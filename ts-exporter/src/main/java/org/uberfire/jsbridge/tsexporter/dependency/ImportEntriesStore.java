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
import java.util.stream.IntStream;

import org.uberfire.jsbridge.tsexporter.meta.Translatable;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.util.IndirectHashMap;
import org.uberfire.jsbridge.tsexporter.util.Utils;

import static java.lang.String.format;
import static java.util.Collections.singleton;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.util.Utils.get;

public class ImportEntriesStore {

    private final IndirectHashMap<ImportEntry, Set<DependencyRelation.Kind>> dependencies;
    private final TsClass tsClass;

    public ImportEntriesStore(final TsClass tsClass) {
        this.tsClass = tsClass;
        this.dependencies = new IndirectHashMap<>(ImportEntry::relativePath);
    }

    public Translatable with(final DependencyRelation.Kind kind,
                             final Translatable type) {

        type.getAggregatedImportEntries().forEach(e -> dependencies.merge(e, singleton(kind), Utils::mergeSets));
        return type;
    }

    public String getImportStatements() {
        return getImports().stream()
                .map(relation -> toTypeScriptImportSource(relation.getImportEntry()))
                .sorted()
                .collect(joining("\n"));
    }

    public Set<DependencyRelation> getImports() {
        return dependencies.entrySet().stream()
                .filter(e -> !e.getKey().represents(tsClass.getType()))
                .map(e -> new DependencyRelation(e.getKey(), e.getValue()))
                .collect(toSet());
    }

    private String toTypeScriptImportSource(final ImportEntry dependency) {
        final String uniqueName = dependency.uniqueName(tsClass.getType());
        final String simpleName = get(-1, uniqueName.split("_"));

        if (!tsClass.getModuleName().equals(dependency.getModuleName())) {
            return format("import { %s as %s } from '%s';", simpleName, uniqueName, dependency.getModuleName());
        }

        final int numberOfDirectoriesToGoBackUntilTheRootDir = tsClass.getRelativePath().split("/").length - 1;
        final String dotDotSlashPart = IntStream.range(0, numberOfDirectoriesToGoBackUntilTheRootDir).boxed()
                .map(i -> "../")
                .collect(joining(""));

        return format("import { %s as %s } from '%s';", simpleName, uniqueName, dotDotSlashPart + dependency.relativePath());
    }
}
