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

package org.uberfire.jsbridge.tsexporter.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.uberfire.jsbridge.tsexporter.Main;
import org.uberfire.jsbridge.tsexporter.meta.ImportableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ImportStore {

    public final List<JavaType> dependencies = new ArrayList<>();

    public <T extends JavaType> T importing(final T type) {
        dependencies.add(type);
        return type;
    }

    public List<ImportableTsType> getImports() {
        final Map<String, List<ImportableTsType>> visited = new HashMap<>();
        return dependencies.stream()
                .map(JavaType::asImportableJavaType)
                .filter(Optional::isPresent).map(Optional::get)
                .flatMap(importableJavaType -> importableJavaType.getDirectImportableTsTypes(visited).stream())
                .map(s -> Main.elements.getTypeElement(s.getCanonicalFqcn()).asType())
                .map(unownedType -> new JavaType(unownedType).asImportableJavaType())
                .filter(Optional::isPresent).map(Optional::get)
                .map(ImportableJavaType::asImportableTsType)
                .filter(Optional::isPresent).map(Optional::get)
                .collect(toList());
    }

    public String getImportStatements() {
        return getImports().stream()
                .map(ImportableTsType::asTsImportSource)
                .distinct()
                .collect(joining("\n"));
    }
}
