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

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.ExecutableType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;
import javax.lang.model.type.WildcardType;

import org.uberfire.jsbridge.tsexporter.Main;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.type.TypeKind.TYPEVAR;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.DEFAULT;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.EXTENDS;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.FIELD;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.PARAMETER;

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

    public enum TsTypeTarget {
        FIELD,
        EXTENDS,
        PARAMETER,
        DEFAULT;
    }

    public String toUniqueTsType() {
        return toUniqueTsType(DEFAULT);
    }

    public String toUniqueTsType(final TsTypeTarget tsTypeTarget) {
        return toUniqueTsType(type, tsTypeTarget, new HashMap<>());
    }

    private String toUniqueTsType(final TypeMirror type,
                                  final TsTypeTarget tsTypeTarget,
                                  final Map<String, String> visitedTypeArguments) {

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
                return "null"; //FIXME: undefined?
            case ARRAY:
                return format("%s[]", toUniqueTsType(((ArrayType) type).getComponentType(), tsTypeTarget, visitedTypeArguments));
            case CHAR:
                return "string";
            case BOOLEAN:
                return "boolean";
            case TYPEVAR:
                final TypeMirror resolvedType;
                try {
                    resolvedType = types.asMemberOf((DeclaredType) owner, types.asElement(type));
                } catch (final Exception e) {
                    final String translatedTypeArgument = translateUnresolvableTypeArgument((TypeVariable) type, tsTypeTarget, visitedTypeArguments);
                    visitedTypeArguments.put(type.toString(), translatedTypeArgument);
                    return translatedTypeArgument;
                }

                if (resolvedType.getKind().equals(TYPEVAR)) {
                    final String translatedTypeArgument = translateUnresolvableTypeArgument((TypeVariable) resolvedType, tsTypeTarget, visitedTypeArguments);
                    visitedTypeArguments.put(resolvedType.toString(), translatedTypeArgument);
                    return translatedTypeArgument;
                } else {
                    return toUniqueTsType(resolvedType, tsTypeTarget, visitedTypeArguments);
                }
            case DECLARED:
                final DeclaredType declaredType = (DeclaredType) type;
                final String fqcn = declaredType.asElement().toString();
                final List<String> typeArguments = extractTranslatedTypeArguments(declaredType, tsTypeTarget, visitedTypeArguments);

                switch (fqcn) {
                    case "java.lang.Object":
                        return "any /* object */";
                    case "java.util.Date":
                        return "any /* date */"; //FIXME: Opinionate?
                    case "java.lang.Throwable":
                        return "any /* throwable */";
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
                    case "java.lang.Class":
                        return "any /* class */";
                    case "java.util.Map.Entry":
                        return "any /* map entry */";
                    case "java.util.HashMap.Node":
                        return "any /* map node */";
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
                    case "java.util.Collection":
                        return format("%s[]", typeArguments.get(0));
                    default:
                        if (typeArguments.isEmpty()) {
                            return fqcn.replace(".", "_");
                        } else {
                            return format("%s<%s>",
                                          fqcn.replace(".", "_"),
                                          typeArguments.stream().collect(joining(", ")));
                        }
                }
            case WILDCARD:
                final WildcardType wildcardType = (WildcardType) type;
                if (wildcardType.getExtendsBound() != null) {
                    return toUniqueTsType(wildcardType.getExtendsBound(), tsTypeTarget, visitedTypeArguments);
                } else if (wildcardType.getSuperBound() != null) {
                    return toUniqueTsType(wildcardType.getSuperBound(), tsTypeTarget, visitedTypeArguments);
                } else {
                    return "any /* wildcard */";
                }
            case EXECUTABLE:
                final ExecutableType executableType = (ExecutableType) type;
                //FIXME: Resolve type arguments.
                return executableType.getTypeVariables().isEmpty() ? "" : "<" + executableType.getTypeVariables().stream().map(s -> s.asElement().getSimpleName().toString()).collect(joining(", ")) + ">";
            case PACKAGE:
            case NONE:
            case ERROR:
            case OTHER:
            case UNION:
            case INTERSECTION:
            default:
                return "any /* unknown */";
        }
    }

    private List<String> extractTranslatedTypeArguments(final DeclaredType declaredType,
                                                        final TsTypeTarget tsTypeTarget,
                                                        final Map<String, String> visitedTypeArguments) {

        final List<String> typeArguments = declaredType.getTypeArguments().stream()
                .map(typeArgument -> toUniqueTsType(typeArgument, tsTypeTarget, visitedTypeArguments))
                .collect(toList());

        if (!typeArguments.isEmpty()) {
            return typeArguments;
        }

        final TypeElement vanillaTypeElement = Main.elements.getTypeElement(declaredType.asElement().toString());
        if (vanillaTypeElement != null && !vanillaTypeElement.getTypeParameters().isEmpty()) {
            return vanillaTypeElement.getTypeParameters().stream().map(s -> "any").collect(toList());
        }

        return typeArguments;
    }

    public Optional<ImportableJavaType> asImportableJavaType() {
        switch (type.getKind()) {
            case ARRAY:
                return new JavaType(((ArrayType) type).getComponentType(), owner).asImportableJavaType();
            case TYPEVAR:
                try {
                    final TypeMirror resolvedType = types.asMemberOf((DeclaredType) owner, types.asElement(this.type));
                    if (resolvedType.getKind().equals(TYPEVAR)) {
                        final TypeVariable typeVariable = (TypeVariable) resolvedType;
                        if (typeVariable.getUpperBound() != null) {
                            return new JavaType(typeVariable.getUpperBound(), owner).asImportableJavaType();
                        } else if (typeVariable.getLowerBound() != null) {
                            return new JavaType(typeVariable.getLowerBound(), owner).asImportableJavaType();
                        } else {
                            return Optional.empty();
                        }
                    } else {
                        return new JavaType(resolvedType, owner).asImportableJavaType();
                    }
                } catch (final Exception e) {
                    return new JavaType(((TypeVariable) type).getUpperBound(), owner).asImportableJavaType();
                }
            case WILDCARD:
                final WildcardType wildcardType = (WildcardType) type;
                if (wildcardType.getExtendsBound() != null) {
                    return new JavaType(wildcardType.getExtendsBound(), owner).asImportableJavaType();
                } else if (wildcardType.getSuperBound() != null) {
                    return new JavaType(wildcardType.getSuperBound(), owner).asImportableJavaType();
                } else {
                    return Optional.empty();
                }
            case DECLARED:
                return Optional.of(new ImportableJavaType(this));
            default:
                return Optional.empty();
        }
    }

    private String translateUnresolvableTypeArgument(final TypeVariable typeVariable,
                                                     final TsTypeTarget tsTypeTarget,
                                                     final Map<String, String> visitedTypeArguments) {

        if (visitedTypeArguments.containsKey(typeVariable.toString())) {
            return visitedTypeArguments.get(typeVariable.toString());
        }

        if (typeVariable.getUpperBound() != null) {
            if (Arrays.asList(FIELD, EXTENDS, PARAMETER).contains(tsTypeTarget)) {
                return typeVariable.toString();
            } else {
                return typeVariable.toString() + " extends " + toUniqueTsType(typeVariable.getUpperBound(), tsTypeTarget, visitedTypeArguments);
            }
        } else if (typeVariable.getLowerBound() != null) {
            return toUniqueTsType(typeVariable.getLowerBound(), tsTypeTarget, visitedTypeArguments);
        } else {
            return typeVariable.toString();
        }
    }

    public String getFlatFqcn() {
        return types.asElement(type).toString();
    }

    public TypeMirror getType() {
        return type;
    }
}
