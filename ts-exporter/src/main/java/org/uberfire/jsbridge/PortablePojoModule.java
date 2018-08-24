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

package org.uberfire.jsbridge;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;

import static java.lang.String.format;
import static java.util.stream.Collectors.*;
import static org.uberfire.jsbridge.RemoteTsExporter.currentMavenModuleName;

public class PortablePojoModule {

    private final ImportableJavaType importableJavaType;
    private final String moduleName;

    private PortablePojoModule(final String moduleName,
                               final ImportableJavaType importableJavaType) {

        this.importableJavaType = importableJavaType;
        this.moduleName = moduleName;
    }

    private String getPath1() {
        return "output/" + moduleName + "/" + importableJavaType.getFlatFqcn().replace(".", "/");
    }

    public String getPath2() {
        return moduleName + "/" + importableJavaType.getFlatFqcn().replace(".", "/");
    }

    public String getOriginatingFqcn() {
        return importableJavaType.getFlatFqcn();
    }

    public String getVariableName() {
        return importableJavaType.getFlatFqcn().replace(".", "_");
    }

    public List<PortablePojoModule> getDependencies() {
        return importableJavaType.getAllTsImportableTypes(new HashSet<>(), 1).stream()
                .map(PortablePojoModule::extractPortablePojoModule)
                .filter(Optional::isPresent).map(Optional::get)
                .collect(toList());
    }

    public String asTsImportSource() {
        return format("import %s from \"%s\";",
                      getVariableName(),
                      getPath1());
    }

    public static Optional<PortablePojoModule> extractPortablePojoModule(final ImportableJavaType importableJavaType) {
        try {
            final Class<?> clazz = Class.forName(importableJavaType.getFlatFqcn());
            if (clazz.getPackage().getName().startsWith("java")) {
                return Optional.empty();
            }

            final String path = clazz.getResource('/' + clazz.getName().replace('.', '/') + ".class").toString();

            // Nice RegEx explanation:
            // 1. Begin with a slash => (/)
            // 2. Followed by a sequence containing letters or dashes => [\\w-]+ (the plus sign indicates that this sequence must have at least one character.)
            // 3. Followed by a single dash => (-)
            // 4. Followed by a sequence of digits and dots => [\\d.]+ (notice the plus sign!)
            // 5. Followed by pretty much anything => (.*)
            // 6. Followed by ".jar!" => \\.jar!
            final String[] split = path.split("(/)[\\w-]+(-)[\\d.]+(.*)\\.jar!")[0].split("/");

            return Optional.of(new PortablePojoModule(split[split.length - 2], importableJavaType));
        } catch (final ClassNotFoundException e) {
            return Optional.of(new PortablePojoModule(currentMavenModuleName, importableJavaType));
        }
    }

    public DeclaredType getType() {
        return (DeclaredType) importableJavaType.type;
    }
}
