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
import java.util.stream.Stream;

import javax.lang.model.element.ElementKind;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;
import javax.lang.model.type.WildcardType;

import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.uberfire.jsbridge.RemoteTsExporter.types;

public class JavaType {

    protected final TypeMirror type;
    protected final TypeMirror owner;

    public JavaType(final TypeMirror type, final TypeMirror owner) {
        if (type == null || owner == null) {
            throw new RuntimeException("null arguments");
        }
        this.type = type;
        this.owner = owner;
    }

    public String toUniqueTsType() {
        return toUniqueTsType(type);
    }

    private String toUniqueTsType(final TypeMirror type) {
        switch (type.getKind()) {
            case INT:
            case BYTE:
            case DOUBLE:
            case FLOAT:
            case SHORT:
            case LONG:
                return "number";
            case VOID:
                return "void";
            case NULL:
                return "null";
            case ARRAY:
                return format("%s[]", toUniqueTsType(((ArrayType) type).getComponentType()));
            case CHAR:
                return "string";
            case BOOLEAN:
                return "boolean";
            case TYPEVAR:
                try {
                    return toUniqueTsType(types.asMemberOf((DeclaredType) owner, types.asElement(type)));
                } catch (final Exception e) {
                    return toUniqueTsType(((TypeVariable) type).getUpperBound());
                }
            case DECLARED:
                final DeclaredType declaredType = (DeclaredType) type;
                final List<String> typeArguments = declaredType.getTypeArguments().stream().map(this::toUniqueTsType).collect(toList());

                if (typeArguments.isEmpty()) {
                    final String fqcn = declaredType.asElement().toString();
                    switch (fqcn) {
                        case "java.lang.Object":
                            return "any";
                        case "java.util.Date":
                            return "any /* date */"; //FIXME: Opinionate?
                        case "java.lang.Boolean":
                            return "boolean";
                        case "java.lang.String":
                            return "string";
                        case "java.lang.Integer":
                        case "java.lang.Byte":
                        case "java.lang.Double":
                        case "java.lang.Float":
                        case "java.lang.Long":
                        case "java.lang.Number":
                        case "java.lang.Short":
                            return "number";
                        default:
                            return fqcn.replace(".", "_");
                    }
                }

                switch (declaredType.asElement().toString()) {
                    case "java.util.HashMap":
                    case "java.util.Map":
                        final String s0 = typeArguments.get(0);
                        final String s1 = typeArguments.get(1);
                        return format("Map<%s, %s>", s0, s1);
                    case "java.util.Set":
                    case "java.util.HashSet":
                    case "java.util.List":
                    case "java.util.ArrayList":
                    case "java.util.LinkedList":
                        return format("%s[]", typeArguments.get(0));
                    default:
                        return format("%s<%s>",
                                      declaredType.asElement().toString().replace(".", "_"),
                                      typeArguments.stream().collect(joining(", ")));
                }
            case WILDCARD:
                final WildcardType wildcardType = (WildcardType) type;
                if (wildcardType.getExtendsBound() != null) {
                    return toUniqueTsType(wildcardType.getExtendsBound());
                } else if (wildcardType.getSuperBound() != null) {
                    return toUniqueTsType(wildcardType.getSuperBound());
                } else {
                    return "any";
                }
            case PACKAGE:
            case NONE:
            case ERROR:
            case OTHER:
            case UNION:
            case EXECUTABLE:
            case INTERSECTION:
            default:
                return "any";
        }
    }

    public Optional<ImportableJavaType> asImportableJavaType() {
        switch (type.getKind()) {
            case ARRAY:
                return new JavaType(((ArrayType) type).getComponentType(), owner).asImportableJavaType();
            case TYPEVAR:
                try {
                    return Optional.of(new ImportableJavaType(types.asMemberOf((DeclaredType) owner, types.asElement(type)), owner));
                } catch (final Exception e) {
                    return Optional.of(new ImportableJavaType(((TypeVariable) type).getUpperBound(), owner));
                }
            case DECLARED:
                if (((DeclaredType) type).asElement().getKind().equals(ElementKind.ENUM)) {
                    //FIXME: How to deal with enums?
                    return Optional.empty();
                } else {
                    return Optional.of(new ImportableJavaType(type, owner));
                }
            default:
                return Optional.empty();
        }
    }

    public List<ImportableJavaType> getDirectImportableNonJdkTypes() {

        final Optional<ImportableJavaType> javaImportable = asImportableJavaType();
        if (!javaImportable.isPresent()) {
            return emptyList();
        }

        //FIXME: What about type arguments of the type arguments?
        final List<ImportableJavaType> nonJdkTypeArguments = ((DeclaredType) javaImportable.get().type).getTypeArguments().stream()
                .filter(typeArgument -> !typeArgument.toString().matches("^javax?.*"))
                .map(typeArgument -> new JavaType(typeArgument, type).asImportableJavaType())
                .filter(Optional::isPresent).map(Optional::get)
                .collect(toList());

        if (type.toString().matches("^javax?.*")) {
            if (nonJdkTypeArguments.isEmpty()) {
                return emptyList();
            } else {
                return nonJdkTypeArguments;
            }
        }

        return Stream.concat(Stream.of(javaImportable.get()), nonJdkTypeArguments.stream()).collect(toList());
    }

    public String getFlatFqcn() {
        return types.asElement(type).toString();
    }
}
