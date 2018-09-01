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

import com.sun.tools.javac.code.Symbol;
import org.uberfire.jsbridge.tsexporter.Main;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.uberfire.jsbridge.tsexporter.Utils.distinctBy;
import static org.uberfire.jsbridge.tsexporter.Utils.getModuleName;

public class ImportStore {

    private final List<TranslatableJavaType> dependencies = new ArrayList<>();

    public TranslatableJavaType with(final TranslatableJavaType type) {
        dependencies.add(type);
        return type;
    }

    public List<ImportableTsType> getImports() {
        return dependencies.stream()
                .flatMap(blergs -> blergs.getDependencies().stream())
                .map(s -> (DeclaredType) Main.types.erasure(s))
                .filter(distinctBy(DeclaredType::toString))
                .map(ImportStore::asImportableTsType)
                .collect(toList());
    }

    public String getImportStatements() {
        return getImports().stream().map(ImportableTsType::asTsImportSource).collect(joining("\n"));
    }

    public static ImportableTsType asImportableTsType(final DeclaredType declaredType) {
        try {
            final Class<?> clazz = Class.forName(((Symbol) declaredType.asElement()).flatName().toString());
            final String path = clazz.getResource('/' + clazz.getName().replace('.', '/') + ".class").toString();
            return new ImportableTsType(getModuleName(path), declaredType);
        } catch (final ClassNotFoundException e) {
            return new ImportableTsType(getModuleName((TypeElement) declaredType.asElement()), declaredType);
        }
    }
}
