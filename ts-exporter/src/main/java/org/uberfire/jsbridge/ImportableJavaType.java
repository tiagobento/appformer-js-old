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

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static org.uberfire.jsbridge.RemoteTsExporter.distinctBy;
import static org.uberfire.jsbridge.RemoteTsExporter.elements;

public class ImportableJavaType extends JavaType {

    public ImportableJavaType(final TypeMirror type, final TypeMirror owner) {
        super(type, owner);
    }

    public List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited) {
        return getAllTsImportableTypes(visited, -1, 0);
    }

    public List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited, int maxDepth) {
        return getAllTsImportableTypes(visited, maxDepth, 0);
    }

    private List<ImportableJavaType> getAllTsImportableTypes(final Set<String> visited, int maxDepth, int depth) {

        final List<ImportableJavaType> rootLevelTypes = new JavaType(type, owner).getDirectImportableNonJdkTypes();
        if (rootLevelTypes.isEmpty()) {
            return emptyList();
        }

        // Cyclic dependencies, yo!
        final List<String> rootLevelTypeFqcns = rootLevelTypes.stream().map(ImportableJavaType::getFlatFqcn).collect(toList());
        if (visited.containsAll(rootLevelTypeFqcns)) {
            return emptyList();
        } else {
            visited.addAll(rootLevelTypeFqcns);
            System.out.println("Getting all dependencies for " + type.toString());
        }

        final List<ImportableJavaType> rootLevelFqcns = rootLevelTypes.stream()
                .filter(distinctBy(JavaType::getFlatFqcn))
                .collect(toList());

        final List<ImportableJavaType> childrenFqcns = (maxDepth != -1 && depth >= maxDepth) ? emptyList() : rootLevelTypes.stream()
                .flatMap(importableJavaType -> extractImportableJavaTypesFromMembers(importableJavaType, visited, maxDepth, depth).stream())
                .collect(toList());

        return Stream.concat(rootLevelFqcns.stream(), childrenFqcns.stream())
                .distinct()
                .collect(toList());
    }

    private List<ImportableJavaType> extractImportableJavaTypesFromMembers(final ImportableJavaType importableJavaType, final Set<String> visited, int maxDepth, int depth) {
        return elements.getAllMembers((TypeElement) ((DeclaredType) importableJavaType.type).asElement()).stream()
                .map(member -> extractRelevantType(member, importableJavaType.type))
                .filter(Optional::isPresent).map(Optional::get)
                .filter(distinctBy(ImportableJavaType::getFlatFqcn))
                .flatMap(dependency -> new ImportableJavaType(dependency.type, owner).getAllTsImportableTypes(visited, maxDepth, depth + 1).stream())
                .collect(toList());
    }

    private Optional<ImportableJavaType> extractRelevantType(final Element member,
                                                             final TypeMirror memberOwner) {

        if (member.getKind().equals(ElementKind.FIELD)) {
            return new JavaType(member.asType(), memberOwner).asImportableJavaType();
        }

        if (member.getKind().equals(ElementKind.METHOD) && !member.getEnclosingElement().toString().matches("javax?.*")) {
            return new JavaType(((ExecutableElement) member).getReturnType(), memberOwner).asImportableJavaType();
        }

        return Optional.empty();
    }
}
