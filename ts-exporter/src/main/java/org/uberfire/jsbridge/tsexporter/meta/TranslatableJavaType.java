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

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.util.ImportStore;

import static java.util.stream.Collectors.toList;

public class TranslatableJavaType {

    private final Function<TranslatableJavaType[], String> uniqueTsType;
    private final List<DeclaredType> types;
    private final List<TranslatableJavaType> dependencies;

    TranslatableJavaType(final String uniqueTsType,
                         final List<DeclaredType> types,
                         final List<TranslatableJavaType> dependencies) {

        this.uniqueTsType = ds -> uniqueTsType;
        this.dependencies = dependencies;
        this.types = types;
    }

    TranslatableJavaType(final Function<TranslatableJavaType[], String> uniqueTsType,
                         final List<DeclaredType> types,
                         final List<TranslatableJavaType> dependencies) {

        this.uniqueTsType = uniqueTsType;
        this.dependencies = dependencies;
        this.types = types;
    }

    public String toTypeScript() {
        return uniqueTsType.apply(dependencies.toArray(new TranslatableJavaType[]{}));
    }

    public List<DeclaredType> getDependencies() {
        final Stream<DeclaredType> deps = dependencies.stream().map(TranslatableJavaType::getDependencies).flatMap(Collection::stream);
        return Stream.concat(types.stream(), deps).collect(toList());
    }

    public Optional<ImportableTsType> toImportableTsType() {
        if (types.isEmpty() || types.get(0).toString().matches("^javax?.*")) {
            return Optional.empty();
        } else {
            return Optional.of(ImportStore.asImportableTsType(types.get(0)));
        }
    }
}
