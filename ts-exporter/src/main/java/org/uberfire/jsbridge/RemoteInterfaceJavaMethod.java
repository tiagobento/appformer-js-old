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

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.lang.model.element.ElementKind;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static javax.lang.model.type.TypeKind.DECLARED;
import static javax.lang.model.type.TypeKind.TYPEVAR;
import static javax.lang.model.type.TypeKind.VOID;
import static javax.lang.model.type.TypeKind.WILDCARD;
import static org.uberfire.jsbridge.RemoteTsExporter.distinctBy;
import static org.uberfire.jsbridge.RemoteTsExporter.elements;
import static org.uberfire.jsbridge.RemoteTsExporter.types;

public class RemoteInterfaceJavaMethod {

    private final ExecutableElement executableElement;
    private final TypeElement _interface;

    public RemoteInterfaceJavaMethod(final TypeElement _interface, final ExecutableElement executableElement) {
        this.executableElement = executableElement;
        this._interface = _interface;
    }

    public String toErraiBusPath() {
        return this.executableElement.getSimpleName() + ":" + getParameterFqcnsByName().values().stream().collect(joining(":"));
    }

    public Map<String, String> getParameterFqcnsByName() {
        return this.executableElement.getParameters().stream().collect(
                toMap(p -> p.getSimpleName().toString(),
                      p -> resolveType(p.asType(), _interface.asType()).map(Object::toString).orElse("any")));
    }

    //TODO: What about primitives/arrays? Test how Errai generates its Bus String
    private Optional<DeclaredType> resolveType(final TypeMirror type, final TypeMirror owner) {
        if (type == null) {
            return Optional.empty();
        } else if (type.getKind().equals(VOID)) {
            return Optional.empty();
        } else if (type.getKind().equals(WILDCARD)) {
            return Optional.empty(); //Optional.ofNullable((DeclaredType) ((WildcardType) type).getExtendsBound());
        } else if (type.getKind().equals(TYPEVAR)) {
            try {
                final TypeMirror typeAsMemberOfRemoteInterface = types.asMemberOf((DeclaredType) owner, types.asElement(type));
                return Optional.of((DeclaredType) typeAsMemberOfRemoteInterface);
            } catch (final Exception e) {
                return Optional.of((DeclaredType) ((TypeVariable) type).getUpperBound());
            }
        } else if (type.getKind().equals(DECLARED)) {
            if (((DeclaredType) type).asElement().getKind().equals(ElementKind.ENUM)) {
                return Optional.empty();
            }
            return Optional.of((DeclaredType) type);
        } else {
            return Optional.empty();
        }
    }

    public String getName() {
        return executableElement.getSimpleName().toString();
    }

    public String getReturnTypeFqcn() {
        if (executableElement.getReturnType().getKind().equals(VOID) || executableElement.getReturnType().getKind().isPrimitive()) {
            return "any";
        } else {
            return resolveType(executableElement.getReturnType(), _interface.asType()).map(Object::toString).orElse("any");
        }
    }

    public List<String> getAllDependenciesOfReturnType() {
        return getAllDependencies(executableElement.getReturnType(), _interface.asType(), new HashSet<>());
    }

    private List<String> getAllDependencies(final TypeMirror type, final TypeMirror typeOwner, final Set<String> visited) {

        final Optional<DeclaredType> typeElement = resolveType(type, typeOwner);
        if (!typeElement.isPresent()) {
            return Collections.emptyList();
        }

        final DeclaredType rootOrigin = typeElement.get();
        final List<DeclaredType> rootLevelTypes = extractRootLevelNonJdkTypes(rootOrigin);
        if (rootLevelTypes.isEmpty()) {
            return Collections.emptyList();
        }

        // Recursive types, yo!
        final List<String> rootLevelTypeFqcns = rootLevelTypes.stream().map(TypeMirror::toString).collect(toList());
        if (visited.containsAll(rootLevelTypeFqcns)) {
            return Collections.emptyList();
        }

        visited.addAll(rootLevelTypeFqcns);
        System.out.println("Getting all dependencies for " + type.toString());

        List<String> rootLevelFqcns = rootLevelTypes.stream()
                .map(s -> ((TypeElement) s.asElement()).getQualifiedName().toString())
                .collect(toList());

        List<String> childrenFqcns = rootLevelTypes.stream().flatMap(memberOwner -> {
            return elements.getAllMembers((TypeElement) memberOwner.asElement()).stream()
                    .map(member -> {
                        if (member.getKind().equals(ElementKind.FIELD)) {
                            return resolveType(member.asType(), memberOwner);
                        } else if (member.getKind().equals(ElementKind.METHOD) && !member.getEnclosingElement().toString().matches("javax?.*")) {
                            return resolveType(((ExecutableElement) member).getReturnType(), memberOwner);
                        } else {
                            return Optional.<DeclaredType>empty();
                        }
                    })
                    .filter(Optional::isPresent).map(Optional::get)
                    .filter(distinctBy(TypeMirror::toString))
                    .flatMap(dependency -> getAllDependencies(dependency, rootOrigin, visited).stream());
        }).collect(toList());

        return Stream.concat(rootLevelFqcns.stream(), childrenFqcns.stream()).distinct().collect(Collectors.toList());
    }

    private List<DeclaredType> extractRootLevelNonJdkTypes(final DeclaredType type) {
        final List<DeclaredType> nonJdkTypeArguments = type.getTypeArguments().stream()
                .filter(typeArgument -> !typeArgument.toString().matches("javax?.*"))
                .map(typeArgument -> resolveType(typeArgument, type))
                .filter(Optional::isPresent).map(Optional::get)
                .collect(Collectors.toList());

        if (type.toString().matches("javax?.*")) {
            if (nonJdkTypeArguments.isEmpty()) {
                return Collections.emptyList();
            } else {
                return nonJdkTypeArguments;
            }
        }

        return Stream.concat(Stream.of(type), nonJdkTypeArguments.stream()).collect(toList());
    }

    public Collection<String> getDirectParameterDependencies() {
        return getParameterFqcnsByName().values();
    }
}
