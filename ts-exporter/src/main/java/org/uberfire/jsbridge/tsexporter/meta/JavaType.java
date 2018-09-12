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
import java.util.Set;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.ExecutableType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.TypeVariable;
import javax.lang.model.type.WildcardType;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorDependency;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.dependency.Dependency;
import org.uberfire.jsbridge.tsexporter.dependency.JavaDependency;

import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptySet;
import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Stream.concat;
import static javax.lang.model.type.TypeKind.NONE;
import static javax.lang.model.type.TypeKind.NULL;
import static javax.lang.model.type.TypeKind.TYPEVAR;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_BIG_DECIMAL;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_BIG_INTEGER;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_BYTE;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_DOUBLE;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_FLOAT;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_INTEGER;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_LINKED_LIST;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_LONG;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_NUMBER;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_OPTIONAL;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_SHORT;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_TREE_MAP;
import static org.uberfire.jsbridge.tsexporter.dependency.BuiltInDependency.JAVA_TREE_SET;

public class JavaType {

    public static final ThreadLocal<Boolean> SIMPLE_NAMES = ThreadLocal.withInitial(() -> Boolean.FALSE);

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
        return types.asElement(type);
    }

    public enum TsTypeTarget {
        TYPE_ARGUMENT_USE,
        TYPE_ARGUMENT_DECLARATION,
        TYPE_ARGUMENT_IMPORT
    }

    private Translatable simpleTranslatable(final String name) {
        return new Translatable(name, emptySet(), emptyList());
    }

    public Translatable translate(final TsTypeTarget tsTypeTarget,
                                  final DecoratorStore decoratorStore) {

        return translate(type, tsTypeTarget, decoratorStore);
    }

    private Translatable translate(final TypeMirror type,
                                   final TsTypeTarget tsTypeTarget,
                                   final DecoratorStore decoratorStore) {

        switch (type.getKind()) {
            case INT:
                return new Translatable(JAVA_INTEGER.getUniqueName(), singleton(JAVA_INTEGER), emptyList());
            case BYTE:
                return new Translatable(JAVA_BYTE.getUniqueName(), singleton(JAVA_BYTE), emptyList());
            case DOUBLE:
                return new Translatable(JAVA_DOUBLE.getUniqueName(), singleton(JAVA_DOUBLE), emptyList());
            case FLOAT:
                return new Translatable(JAVA_FLOAT.getUniqueName(), singleton(JAVA_FLOAT), emptyList());
            case SHORT:
                return new Translatable(JAVA_SHORT.getUniqueName(), singleton(JAVA_SHORT), emptyList());
            case LONG:
                return new Translatable(JAVA_LONG.getUniqueName(), singleton(JAVA_LONG), emptyList());
            case VOID:
                return simpleTranslatable("void");
            case NULL:
                return simpleTranslatable("null");
            case CHAR:
                return simpleTranslatable("string");
            case BOOLEAN:
                return simpleTranslatable("boolean");
            case ARRAY:
                final Translatable component = translate(((ArrayType) type).getComponentType(), tsTypeTarget, decoratorStore);
                return new Translatable(format("%s[]", component.toTypeScript()), emptySet(), singletonList(component));
            case TYPEVAR:
                TypeMirror potentiallyResolvedType;
                try {
                    potentiallyResolvedType = types.asMemberOf((DeclaredType) owner, types.asElement(type));
                } catch (final Exception e) {
                    potentiallyResolvedType = type;
                }

                if (!potentiallyResolvedType.getKind().equals(TYPEVAR)) {
                    return translate(potentiallyResolvedType, tsTypeTarget, decoratorStore);
                }

                final TypeVariable unresolvableType = (TypeVariable) potentiallyResolvedType;
                if (!unresolvableType.getLowerBound().getKind().equals(NULL)) {
                    return translate(unresolvableType.getLowerBound(), tsTypeTarget, decoratorStore);
                }

                final TypeMirror upperBoundType = unresolvableType.getUpperBound();
                final boolean hasRelevantUpperBound = !upperBoundType.getKind().equals(NULL) && !upperBoundType.toString().equals("java.lang.Object");
                if (!hasRelevantUpperBound || !tsTypeTarget.equals(TYPE_ARGUMENT_DECLARATION)) {
                    return simpleTranslatable(unresolvableType.toString());
                }

                final Translatable upperBound = translate(upperBoundType, TYPE_ARGUMENT_USE, decoratorStore);
                return new Translatable(unresolvableType.toString() + " extends " + upperBound.toTypeScript(), emptySet(), singletonList(upperBound));
            case DECLARED:
                final DeclaredType declaredType = (DeclaredType) type;
                final List<JavaType> typeArguments = extractTypeArguments(declaredType, tsTypeTarget);

                final List<Translatable> translatedTypeArguments = typeArguments.stream()
                        .map(s -> s.translate(tsTypeTarget, decoratorStore))
                        .collect(toList());

                final String typeArgumentsPart = typeArguments.size() > 0
                        ? "<" + translatedTypeArguments.stream().map(Translatable::toTypeScript).collect(joining(", ")) + ">"
                        : "";

                switch (declaredType.asElement().toString()) {
                    case "java.lang.Integer":
                        return new Translatable(JAVA_INTEGER.getUniqueName(), singleton(JAVA_INTEGER), emptyList());
                    case "java.lang.Byte":
                        return new Translatable(JAVA_BYTE.getUniqueName(), singleton(JAVA_BYTE), emptyList());
                    case "java.lang.Double":
                        return new Translatable(JAVA_DOUBLE.getUniqueName(), singleton(JAVA_DOUBLE), emptyList());
                    case "java.lang.Float":
                        return new Translatable(JAVA_FLOAT.getUniqueName(), singleton(JAVA_FLOAT), emptyList());
                    case "java.lang.Long":
                        return new Translatable(JAVA_LONG.getUniqueName(), singleton(JAVA_LONG), emptyList());
                    case "java.lang.Number":
                        return new Translatable(JAVA_NUMBER.getUniqueName(), singleton(JAVA_NUMBER), emptyList());
                    case "java.lang.Short":
                        return new Translatable(JAVA_SHORT.getUniqueName(), singleton(JAVA_SHORT), emptyList());
                    case "java.math.BigInteger":
                        return new Translatable(JAVA_BIG_INTEGER.getUniqueName(), singleton(JAVA_BIG_INTEGER), emptyList());
                    case "java.math.BigDecimal":
                        return new Translatable(JAVA_BIG_DECIMAL.getUniqueName(), singleton(JAVA_BIG_DECIMAL), emptyList());
                    case "java.util.OptionalInt":
                        return simpleTranslatable("number"); //FIXME: ???
                    case "java.lang.Object":
                        return simpleTranslatable("any /* object */");
                    case "java.util.Date":
                        return simpleTranslatable("any /* date */"); //FIXME: Opinionate?
                    case "java.lang.StackTraceElement":
                        return simpleTranslatable("any /* stack trace element */"); //FIXME: ???
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
                        return simpleTranslatable("any /* map entry */"); //TODO: [key: %s, value: %s] ???
                    case "java.util.HashMap.Node":
                        return simpleTranslatable("any /* map node */"); //TODO: ???
                    case "java.util.Optional":
                        return new Translatable(format("JavaOptional%s", typeArgumentsPart), singleton(JAVA_OPTIONAL), translatedTypeArguments);
                    case "java.util.TreeMap":
                        return new Translatable(format("JavaTreeMap%s", typeArgumentsPart), singleton(JAVA_TREE_MAP), translatedTypeArguments);
                    case "java.util.HashMap":
                    case "java.util.Map":
                        return new Translatable(format("Map%s", typeArgumentsPart), emptySet(), translatedTypeArguments);
                    case "java.util.TreeSet":
                        return new Translatable(format("JavaTreeSet%s", typeArgumentsPart), singleton(JAVA_TREE_SET), translatedTypeArguments);
                    case "java.util.Set":
                    case "java.util.HashSet":
                        return new Translatable(format("Set%s", typeArgumentsPart), emptySet(), translatedTypeArguments);
                    case "java.util.LinkedList":
                        return new Translatable(format("JavaLinkedList%s", typeArgumentsPart), singleton(JAVA_LINKED_LIST), translatedTypeArguments);
                    case "java.util.List":
                    case "java.util.ArrayList":
                    case "java.util.Collection":
                        return new Translatable(format("Array%s", typeArgumentsPart), emptySet(), translatedTypeArguments);
                    default: {
                        if (decoratorStore.hasDecoratorFor(type)) {
                            final DecoratorDependency decorator = decoratorStore.getDecoratorFor(type);
                            return new Translatable(format("%s%s", decorator.uniqueName(declaredType), typeArgumentsPart),
                                                    singleton(decorator),
                                                    translatedTypeArguments);
                        }

                        final String name = (SIMPLE_NAMES.get() || types.asElement(declaredType).equals(types.asElement(owner)))
                                ? declaredType.asElement().getSimpleName().toString()
                                : declaredType.asElement().toString().replace(".", "_");

                        return new Translatable(format("%s%s", name, typeArgumentsPart),
                                                singleton(new JavaDependency(declaredType, decoratorStore)),
                                                translatedTypeArguments);
                    }
                }
            case WILDCARD:
                final WildcardType wildcardType = (WildcardType) type;
                if (wildcardType.getExtendsBound() != null) {
                    return translate(wildcardType.getExtendsBound(), tsTypeTarget, decoratorStore);
                }

                if (wildcardType.getSuperBound() != null) {
                    final Translatable superBound = translate(wildcardType.getSuperBound(), tsTypeTarget, decoratorStore);
                    return new Translatable(format("Partial<%s>", superBound.toTypeScript()), emptySet(), singletonList(superBound));
                }

                return simpleTranslatable("any /* wildcard */");
            case EXECUTABLE:
                if (((ExecutableType) type).getTypeVariables().isEmpty()) {
                    return simpleTranslatable("");
                }

                final List<Translatable> dependencies = ((ExecutableType) type).getTypeVariables().stream()
                        .map(t -> translate(t, tsTypeTarget, decoratorStore))
                        .collect(toList());

                return new Translatable("<" + dependencies.stream().map(Translatable::toTypeScript).collect(joining(", ")) + ">",
                                        emptySet(),
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

    private List<JavaType> extractTypeArguments(final DeclaredType declaredType, TsTypeTarget tsTypeTarget) {

        if (tsTypeTarget.equals(TYPE_ARGUMENT_IMPORT)) {
            return emptyList();
        }

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

    public static class Translatable {

        private final String translated;
        private final Set<Dependency> types;
        private final List<Translatable> aggregated;

        Translatable(final String translated,
                     final Set<Dependency> types,
                     final List<Translatable> aggregated) {

            this.translated = translated;
            this.aggregated = aggregated;
            this.types = types;
        }

        public String toTypeScript() {
            return translated;
        }

        public List<Dependency> getAggregated() {
            return concat(types.stream(),
                          aggregated.stream().flatMap(t -> t.getAggregated().stream()))
                    .collect(toList());
        }

        public boolean canBeSubclassed() {
            return !types.isEmpty();
        }
    }
}
