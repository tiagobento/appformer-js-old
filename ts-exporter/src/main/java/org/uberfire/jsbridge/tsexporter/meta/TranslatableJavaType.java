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

import java.util.List;
import java.util.function.Function;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.Utils;
import org.uberfire.jsbridge.tsexporter.meta.dependency.Dependency;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Stream.concat;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;

public class TranslatableJavaType {

    private final Function<TranslatableJavaType[], String> toTypeScript;
    private final List<Dependency> types;
    private final List<TranslatableJavaType> aggregated;

    TranslatableJavaType(final Function<TranslatableJavaType[], String> uniqueTsType,
                         final List<Dependency> types,
                         final List<TranslatableJavaType> aggregated) {

        this.toTypeScript = uniqueTsType;
        this.aggregated = aggregated;
        this.types = types;
    }

    public String toTypeScript() {
        return toTypeScript.apply(aggregated.toArray(new TranslatableJavaType[]{}));
    }

    public List<Dependency> getAggregated() {
        return concat(types.stream(),
                      aggregated.stream().flatMap(t -> t.getAggregated().stream()))
                .collect(toList());
    }

    public boolean canBeSubclassed() {
        return !types.isEmpty();
    }
}
