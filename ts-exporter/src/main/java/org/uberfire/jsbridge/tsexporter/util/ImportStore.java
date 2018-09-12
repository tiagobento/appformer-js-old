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
import java.util.List;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.Main;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaType;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.uberfire.jsbridge.tsexporter.Utils.distinctBy;
import static org.uberfire.jsbridge.tsexporter.Utils.getModuleName;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;

public class ImportStore {

    private final List<TranslatableJavaType> dependencies = new ArrayList<>();

    public TranslatableJavaType with(final TranslatableJavaType type) {
        dependencies.add(type);
        return type;
    }

    public List<DeclaredType> getImports() {
        return dependencies.stream()
                .flatMap(t -> t.getAggregated().stream())
                .map(s -> (DeclaredType) Main.types.erasure(s))
                .filter(distinctBy(DeclaredType::toString))
                .collect(toList());
    }

    public String getImportStatements(final TsClass tsClass) {
        return getImports(tsClass).stream()
                .map(declaredType -> toTypeScriptImportSource(declaredType, tsClass.getType()))
                .sorted()
                .collect(joining("\n"));
    }

    public List<DeclaredType> getImports(final TsClass tsClass) {
        return getImports().stream()
                .filter(s -> !tsClass.getElement().getQualifiedName().equals(((TypeElement) s.asElement()).getQualifiedName()))
                .collect(toList());
    }

    private String toTypeScriptImportSource(final DeclaredType declaredType, final DeclaredType owner) {
        final String fqcn = ((TypeElement) declaredType.asElement()).getQualifiedName().toString();
        return format("import %s from '%s';",
                      new JavaType(declaredType, owner).translate(TYPE_ARGUMENT_IMPORT).toTypeScript(),
                      "output/" + getModuleName(declaredType) + "/" + fqcn.replace(".", "/"));
    }
}
