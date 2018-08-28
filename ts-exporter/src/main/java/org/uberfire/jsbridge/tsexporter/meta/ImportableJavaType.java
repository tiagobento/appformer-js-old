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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static org.uberfire.jsbridge.tsexporter.Main.currentMavenModuleName;
import static org.uberfire.jsbridge.tsexporter.Main.distinctBy;
import static org.uberfire.jsbridge.tsexporter.Main.elements;
import static org.uberfire.jsbridge.tsexporter.Main.types;

public class ImportableJavaType extends JavaType {


    public ImportableJavaType(final JavaType javaType) {
        super(javaType.type, javaType.owner);
    }

    @Override
    public Optional<ImportableJavaType> asImportableJavaType() {
        return Optional.of(this);
    }

    public List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited) {
        return getAllTsImportableTypes(visited, -1, 0);
    }

    public List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited, final int maxDepth) {
        return getAllTsImportableTypes(visited, maxDepth, 0);
    }

    private List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited, final int maxDepth, final int depth) {

        final List<ImportableTsType> rootLevelTypes = getDirectImportableTsTypes();
        if (rootLevelTypes.isEmpty()) {
            return emptyList();
        }

        // Cyclic dependencies, yo!
        final List<String> rootLevelTypeFqcns = rootLevelTypes.stream().map(ImportableJavaType::getFlatFqcn).collect(toList());
        if (visited.containsAll(rootLevelTypeFqcns)) {
            return emptyList();
        }

        visited.addAll(rootLevelTypeFqcns);
        System.out.println("Getting all dependencies for " + type.toString());

        final List<ImportableJavaType> childrenImportableTypes = (maxDepth != -1 && depth >= maxDepth) ? emptyList() : rootLevelTypes.stream()
                .flatMap(t -> extractImportableJavaTypesFromMembers(t, visited, maxDepth, depth).stream())
                .collect(toList());

        return Stream.concat(rootLevelTypes.stream(), childrenImportableTypes.stream())
                .filter(distinctBy(ImportableJavaType::getFlatFqcn))
                .collect(toList());
    }

    private List<ImportableJavaType> extractImportableJavaTypesFromMembers(final ImportableJavaType importableJavaType,
                                                                           final Set<String> visited,
                                                                           final int maxDepth,
                                                                           final int depth) {

        return elements.getAllMembers((TypeElement) types.asElement(importableJavaType.type)).stream()
                .map(member -> extractNonJdkMemberJavaType(member, importableJavaType.type))
                .map(t -> t.flatMap(JavaType::asImportableJavaType))
                .filter(Optional::isPresent).map(Optional::get)
                .flatMap(t -> t.getAllTsImportableTypes(visited, maxDepth, depth + 1).stream())
                .collect(toList());
    }

    private Optional<JavaType> extractNonJdkMemberJavaType(final Element member,
                                                           final TypeMirror memberOwner) {

        if (member.getKind().equals(ElementKind.FIELD)) {
            return Optional.of(new JavaType(member.asType(), memberOwner));
        }

//        if (member.getKind().equals(ElementKind.METHOD) && !member.getEnclosingElement().toString().matches("javax?.*")) {
//            return Optional.of(new JavaType(((ExecutableElement) member).getReturnType(), memberOwner));
//        }

        return Optional.empty();
    }

    public Optional<ImportableTsType> asImportableTsType() {
        try {

            if (getFlatFqcn().matches("^javax?.*")) {
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
            return Optional.of(new ImportableTsType(currentMavenModuleName, this));
        }
    }

    public List<ImportableTsType> getDirectImportableTsTypes() {

        final List<ImportableTsType> importableTsArgumentTypes = getType().getTypeArguments().stream()
                .map(typeArgument -> new JavaType(typeArgument, owner).asImportableJavaType())
                .filter(Optional::isPresent).map(Optional::get)
                .flatMap(importableJavaType -> importableJavaType.getDirectImportableTsTypes().stream())
                .collect(toList());

        return Stream.concat(asImportableTsType().map(Stream::of).orElse(Stream.empty()),
                             importableTsArgumentTypes.stream()).collect(toList());
    }

    public DeclaredType getType() {
        return (DeclaredType) type;
    }
}
