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

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.ExecutableType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;
import javax.lang.model.type.WildcardType;

import org.uberfire.jsbridge.tsexporter.Main;

import static java.lang.String.format;
import static java.util.Arrays.asList;
import static java.util.Arrays.stream;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.type.TypeKind.NONE;
import static javax.lang.model.type.TypeKind.NULL;
import static javax.lang.model.type.TypeKind.TYPEVAR;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;

public class JavaType {

    public static ThreadLocal<Boolean> SIMPLE_NAMES = ThreadLocal.withInitial(() -> Boolean.FALSE);

    private final TypeMirror type;
    private final TypeMirror owner;

    public JavaType(final TypeMirror type, final TypeMirror owner) {
        if (type == null || owner == null) {
            throw new RuntimeException("null arguments");
        }
        this.type = type;
        this.owner = owner;
    }

    public TypeMirror getType() {
        return type;
    }

    public TypeMirror getOwner() {
        return owner;
    }

    public Element asElement() {
        return Main.types.asElement(type);
    }

    public enum TsTypeTarget {
        TYPE_ARGUMENT_USE,
        TYPE_ARGUMENT_DECLARATION,
        TYPE_ARGUMENT_IMPORT;
    }

    private TranslatableJavaType simpleTranslatable(final String name) {
        return new TranslatableJavaType(d -> name, emptyList(), emptyList());
    }

    public TranslatableJavaType translate() {
        return translate(TYPE_ARGUMENT_DECLARATION);
    }

    public TranslatableJavaType translate(final TsTypeTarget tsTypeTarget) {
        return translate(type, tsTypeTarget);
    }

    private TranslatableJavaType translate(final TypeMirror type,
                                           final TsTypeTarget tsTypeTarget) {

        switch (type.getKind()) {
            case INT:
            case BYTE:
            case DOUBLE:
            case FLOAT:
            case SHORT:
            case LONG:
                return simpleTranslatable("number");
            case VOID:
                return simpleTranslatable("void");
            case NULL:
                return simpleTranslatable("null");
            case CHAR:
                return simpleTranslatable("string");
            case BOOLEAN:
                return simpleTranslatable("boolean");
            case ARRAY:
                return new TranslatableJavaType(t -> format("%s[]", t[0].toTypeScript()),
                                                emptyList(),
                                                singletonList(translate(((ArrayType) type).getComponentType(), tsTypeTarget)));
            case TYPEVAR:
                final TypeMirror resolvedType;
                try {
                    resolvedType = types.asMemberOf((DeclaredType) owner, types.asElement(type));
                } catch (final Exception e) {
                    return translateUnresolvableTypeArgument((TypeVariable) type, tsTypeTarget);
                }

                if (resolvedType.getKind().equals(TYPEVAR)) {
                    return translateUnresolvableTypeArgument((TypeVariable) resolvedType, tsTypeTarget);
                } else {
                    return translate(resolvedType, tsTypeTarget);
                }
            case DECLARED:
                final DeclaredType declaredType = (DeclaredType) type;
                final List<JavaType> typeArguments = extractTypeArguments(declaredType);

                switch (declaredType.asElement().toString()) {
                    case "java.lang.Integer":
                    case "java.lang.Byte":
                    case "java.lang.Double":
                    case "java.lang.Float":
                    case "java.lang.Long":
                    case "java.lang.Number":
                    case "java.lang.Short":
                    case "java.math.BigInteger":
                    case "java.math.BigDecimal":
                    case "java.util.OptionalInt":
                        return simpleTranslatable("number");
                    case "java.lang.Object":
                        return simpleTranslatable("any /* object */");
                    case "java.util.Date":
                        return simpleTranslatable("any /* date */"); //FIXME: Opinionate?
                    case "java.lang.StackTraceElement":
                        return simpleTranslatable("any /* stack trace element */");
                    case "java.lang.Throwable":
                        return simpleTranslatable("any /* throwable */"); //FIXME: ???
                    case "javax.enterprise.event.Event":
                        return simpleTranslatable("any /* javax event */"); //FIXME: ???
                    case "java.lang.Boolean":
                        return simpleTranslatable("boolean");
                    case "java.lang.String":
                    case "java.lang.Character":
                        return simpleTranslatable("string");
                    case "java.lang.Enum":
                        return simpleTranslatable("any /* enum_ */");
                    case "java.lang.Class":
                        return simpleTranslatable("any /* class */");
                    case "java.util.Map.Entry":
                        return simpleTranslatable("any /* map entry */");
                    case "java.util.HashMap.Node":
                        return simpleTranslatable("any /* map node */");
                    case "java.util.Optional":
                        return typeArguments.get(0).translate(tsTypeTarget);
                    case "java.util.HashMap":
                    case "java.util.TreeMap":
                    case "java.util.Map":
                        return new TranslatableJavaType(t -> format("Map<%s, %s>", t[0].toTypeScript(), t[1].toTypeScript()),
                                                        emptyList(),
                                                        asList(typeArguments.get(0).translate(tsTypeTarget),
                                                               typeArguments.get(1).translate(tsTypeTarget)));
                    case "java.util.Set":
                    case "java.util.HashSet":
                    case "java.util.TreeSet":
                    case "java.util.List":
                    case "java.util.ArrayList":
                    case "java.util.LinkedList":
                    case "java.util.Collection":
                        return new TranslatableJavaType(d -> format("%s[]", d[0].toTypeScript()),
                                                        emptyList(),
                                                        singletonList(typeArguments.get(0).translate(tsTypeTarget)));
                    default: {
                        final List<TranslatableJavaType> translatedTypeArguments = typeArguments.stream()
                                .map(s -> s.translate(tsTypeTarget))
                                .collect(toList());

                        final String name = (SIMPLE_NAMES.get() || Main.types.asElement(declaredType).equals(Main.types.asElement(owner)))
                                ? declaredType.asElement().getSimpleName().toString()
                                : declaredType.asElement().toString().replace(".", "_");

                        final String typeArgumentsPart = !(typeArguments.size() == 0)
                                ? "<" + translatedTypeArguments.stream().map(TranslatableJavaType::toTypeScript).collect(joining(", ")) + ">"
                                : "";

                        return new TranslatableJavaType(d -> format("%s%s", name, tsTypeTarget.equals(TYPE_ARGUMENT_IMPORT) ? "" : typeArgumentsPart),
                                                        singletonList(declaredType),
                                                        translatedTypeArguments);
                    }
                }
            case WILDCARD:
                final WildcardType wildcardType = (WildcardType) type;
                if (wildcardType.getExtendsBound() != null) {
                    return translate(wildcardType.getExtendsBound(), tsTypeTarget);
                } else if (wildcardType.getSuperBound() != null) {
                    return new TranslatableJavaType(d -> format("Partial<%s>", d[0].toTypeScript()),
                                                    emptyList(),
                                                    singletonList(translate(wildcardType.getSuperBound(), tsTypeTarget)));
                } else {
                    return simpleTranslatable("any /* wildcard */");
                }
            case EXECUTABLE:
                if (((ExecutableType) type).getTypeVariables().isEmpty()) {
                    return simpleTranslatable("");
                }

                final List<TranslatableJavaType> dependencies = ((ExecutableType) type).getTypeVariables().stream()
                        .map(t -> translate(t, tsTypeTarget))
                        .collect(toList());

                return new TranslatableJavaType(d -> "<" + stream(d).map(TranslatableJavaType::toTypeScript).collect(joining(", ")) + ">",
                                                emptyList(),
                                                dependencies);
            case PACKAGE:
            case NONE:
                return simpleTranslatable("any");
            case ERROR:
            case OTHER:
            case UNION:
            case INTERSECTION:
            default:
                return simpleTranslatable("any /* unknown */");
        }
    }

    private List<JavaType> extractTypeArguments(final DeclaredType declaredType) {

        final List<JavaType> typeArguments = declaredType.getTypeArguments().stream()
                .map(typeArgument -> new JavaType(typeArgument, owner))
                .collect(toList());

        if (!typeArguments.isEmpty()) {
            return typeArguments;
        }

        return ((TypeElement) ((DeclaredType) types.erasure(declaredType)).asElement()).getTypeParameters().stream()
                .map(s -> new JavaType(types.getNoType(NONE), types.getNoType(NONE)))
                .collect(toList());
    }

    private TranslatableJavaType translateUnresolvableTypeArgument(final TypeVariable typeVariable,
                                                                   final TsTypeTarget tsTypeTarget) {

        if (!typeVariable.getUpperBound().getKind().equals(NULL)) {
            if (tsTypeTarget.equals(TYPE_ARGUMENT_DECLARATION)) {
                if (!typeVariable.getUpperBound().toString().equals("java.lang.Object")) {
                    return new TranslatableJavaType(d -> typeVariable.toString() + " extends " + d[0].toTypeScript(),
                                                    emptyList(),
                                                    singletonList(translate(typeVariable.getUpperBound(), TYPE_ARGUMENT_USE)));
                } else {
                    return simpleTranslatable(typeVariable.toString());
                }
            } else {
                return simpleTranslatable(typeVariable.toString());
            }
        } else {
            if (!typeVariable.getLowerBound().getKind().equals(NULL)) {
                return translate(typeVariable.getLowerBound(), tsTypeTarget);
            } else {
                return simpleTranslatable(typeVariable.toString());
            }
        }
    }
}
