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

import javax.lang.model.type.DeclaredType;

import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class AnyDeclaredTranslatableJavaType {

    private final DeclaredType declaredType;
    private final List<JavaType> typeArguments;

    AnyDeclaredTranslatableJavaType(final DeclaredType declaredType,
                                    final List<JavaType> typeArguments) {

        this.declaredType = declaredType;
        this.typeArguments = typeArguments;
    }

    public TranslatableJavaType translate(final JavaType.TsTypeTarget tsTypeTarget) {
        return new TranslatableJavaType(this::getName, singletonList(declaredType), getDependencies(tsTypeTarget));
    }

    private List<TranslatableJavaType> getDependencies(final JavaType.TsTypeTarget tsTypeTarget) {
        return typeArguments.stream()
                .map(s -> s.translate(tsTypeTarget))
                .collect(toList());
    }

    private String getName(final TranslatableJavaType[] typeArguments) {

        final String name = JavaType.SIMPLE_NAMES
                ? declaredType.asElement().getSimpleName().toString()
                : declaredType.asElement().toString().replace(".", "_");

        final String typeArgumentsPart = !(typeArguments.length == 0)
                ? "<" + stream(typeArguments).map(TranslatableJavaType::toTypeScript).collect(joining(", ")) + ">"
                : "";

        return format("%s%s", name, typeArgumentsPart);
    }
}
