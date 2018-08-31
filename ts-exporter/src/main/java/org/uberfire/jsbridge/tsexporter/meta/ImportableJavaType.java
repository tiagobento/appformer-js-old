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

package org.uberfire.jsbridge.tsexporter.meta;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Stream.empty;
import static org.uberfire.jsbridge.tsexporter.Utils.getModuleName;

public class ImportableJavaType extends JavaType {

    ImportableJavaType(final JavaType javaType) {
        super(javaType.type, javaType.owner);
    }

    @Override
    public Optional<ImportableJavaType> asImportableJavaType() {
        return Optional.of(this);
    }

    public Optional<ImportableTsType> asImportableTsType() {
        try {

            if (getCanonicalFqcn().matches("^javax?.*")) {
                return Optional.empty();
            }

            final Class<?> clazz = Class.forName(getFlatFqcn());
            final String path = clazz.getResource('/' + clazz.getName().replace('.', '/') + ".class").toString();

            // Nice RegEx explanation:
            // 1. Begin with a slash => (/)
            // 2. Followed by a sequence containing letters or dashes => [\\w-]+ (the plus sign indicates that this sequence must have at least one character.)
            // 3. Followed by a single dash => (-)
            // 4. Followed by a sequence of digits and dots => [\\d.]+ (notice the plus sign!)
            // 5. Followed by pretty much anything => (.*)
            // 6. Followed by ".jar!" => \\.jar!
            final String[] split = path.split("(/)[\\w-]+(-)[\\d.]+(.*)\\.jar!")[0].split("/");

            return Optional.of(new ImportableTsType(split[split.length - 2], this));
        } catch (final ClassNotFoundException e) {
            return Optional.of(new ImportableTsType(getModuleName((TypeElement) getType().asElement()), this));
        }
    }

    public List<ImportableTsType> getDirectImportableTsTypes(final Map<String, List<ImportableTsType>> visited) {
        if (visited.containsKey(getType().toString())) {
            return visited.get(getType().toString());
        }

        final List<ImportableTsType> importableTsArgumentTypes = getType().getTypeArguments().stream()
                .map(typeArgument -> new JavaType(typeArgument, owner).asImportableJavaType())
                .filter(Optional::isPresent).map(Optional::get)
                .peek(t -> visited.put(getType().toString(), t.asImportableTsType().map(Collections::singletonList).orElse(emptyList())))
                .flatMap(importableJavaType -> importableJavaType.getDirectImportableTsTypes(visited).stream())
                .collect(toList());

        final List<ImportableTsType> ret =
                Stream.concat(asImportableTsType().map(Stream::of).orElse(empty()),
                              importableTsArgumentTypes.stream()).collect(toList());

        visited.put(getType().toString(), ret);
        return ret;
    }

    public DeclaredType getType() {
        return (DeclaredType) type;
    }
}
