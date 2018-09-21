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

package org.uberfire.jsbridge.tsexporter.model;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntriesStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.Translatable;
import org.uberfire.jsbridge.tsexporter.util.Lazy;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.ENUM;
import static javax.lang.model.element.ElementKind.ENUM_CONSTANT;
import static javax.lang.model.element.ElementKind.INTERFACE;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.NO_DECORATORS;
import static org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation.Kind.FIELD;
import static org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation.Kind.HIERARCHY;
import static org.uberfire.jsbridge.tsexporter.meta.Translatable.SourceUsage.FIELD_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.Translatable.SourceUsage.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.Translatable.SourceUsage.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.util.Utils.formatRightToLeft;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PojoTsClass implements TsClass {

    private final DeclaredType declaredType;
    private final DecoratorStore decoratorStore;
    private final ImportEntriesStore importStore;
    private final Lazy<String> source;
    private final Lazy<Translatable> translatableSelf;

    @Override
    public String toSource() {
        return source.get();
    }

    public PojoTsClass(final DeclaredType declaredType,
                       final DecoratorStore decoratorStore) {

        this.declaredType = declaredType;
        this.decoratorStore = decoratorStore;
        this.importStore = new ImportEntriesStore(this);
        this.translatableSelf = new Lazy<>(() -> importStore.with(HIERARCHY, new JavaType(declaredType, declaredType).translate(NO_DECORATORS)));
        this.source = new Lazy<>(() -> {
            if (asElement().getKind().equals(INTERFACE)) {
                return toInterface();
            } else if (asElement().getKind().equals(ENUM)) {
                return toEnum();
            } else {
                return toClass();
            }
        });
    }

    //FIXME: Enum extending interfaces?
    private String toEnum() {
        return formatRightToLeft(
                lines("",
                      "export enum %s { %s }"),

                () -> translatableSelf.get().toTypeScript(TYPE_ARGUMENT_DECLARATION),
                this::enumFields);
    }

    private String toInterface() {
        return formatRightToLeft(
                lines("",
                      "%s",
                      "",
                      "export interface %s %s {",
                      "}"),

                this::imports,
                () -> translatableSelf.get().toTypeScript(TYPE_ARGUMENT_DECLARATION),
                this::interfaceHierarchy);
    }

    private String toClass() {
        return formatRightToLeft(
                lines("",
                      "import { Portable } from 'appformer-js';",
                      "%s",
                      "",
                      "export %s class %s %s {",
                      "",
                      "  protected readonly _fqcn: string = '%s';",
                      "",
                      "%s",
                      "",
                      "  constructor(self: { %s }) {",
                      "    %s",
                      "    Object.assign(this, self);",
                      "  }",
                      "}"),

                this::imports,
                this::abstractOrNot,
                () -> translatableSelf.get().toTypeScript(TYPE_ARGUMENT_DECLARATION),
                this::classHierarchy,
                this::fqcn,
                this::fields,
                () -> extractConstructorArgs(asElement()),
                this::superConstructorCall
        );
    }

    private String imports() {
        return importStore.getImportStatements();
    }

    private String fqcn() {
        return asElement().getQualifiedName().toString();
    }

    private String enumFields() {
        return asElement().getEnclosedElements().stream()
                .filter(s -> s.getKind().equals(ENUM_CONSTANT))
                .map(Element::getSimpleName)
                .collect(joining(", "));
    }

    private String fields() {
        return asElement().getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(this::toFieldSource)
                .collect(joining("\n"));
    }

    private String toFieldSource(final Element fieldElement) {
        return format("public readonly %s?: %s;",
                      fieldElement.getSimpleName(),
                      importStore.with(FIELD, new JavaType(fieldElement.asType(), declaredType)
                              .translate(decoratorStore)).toTypeScript(FIELD_DECLARATION));
    }

    private Translatable superclass() {
        return new JavaType(asElement().getSuperclass(), declaredType).translate(NO_DECORATORS);
    }

    private String superConstructorCall() {
        return superclass().canBeSubclassed() ? "super({...self.inherited});" : "";
    }

    private String classHierarchy() {
        final String _extends = superclass().canBeSubclassed()
                ? "extends " + importStore.with(HIERARCHY, superclass()).toTypeScript(TYPE_ARGUMENT_USE)
                : "";

        final String portablePart = format("Portable<%s>", translatableSelf.get().toTypeScript(TYPE_ARGUMENT_USE));
        if (interfaces().isEmpty()) {
            return _extends + " implements " + portablePart;
        }

        final String interfacesPart = interfaces().stream()
                .map(javaType -> importStore.with(HIERARCHY, javaType.translate(NO_DECORATORS)).toTypeScript(TYPE_ARGUMENT_USE))
                .collect(joining(", "));

        return _extends + " " + format("implements %s, %s", interfacesPart, portablePart);
    }

    private String abstractOrNot() {
        return asElement().getModifiers().contains(ABSTRACT) ? "abstract" : "";
    }

    private String interfaceHierarchy() {
        if (interfaces().isEmpty()) {
            return "";
        }

        return "extends " + interfaces().stream()
                .map(javaType -> importStore.with(HIERARCHY, javaType.translate(NO_DECORATORS)).toTypeScript(TYPE_ARGUMENT_USE))
                .collect(joining(", "));
    }

    private List<JavaType> interfaces() {
        return ((TypeElement) declaredType.asElement()).getInterfaces().stream()
                .map(t -> new JavaType(t, declaredType))
                .filter(s -> s.translate(NO_DECORATORS).canBeSubclassed())
                .collect(toList());
    }

    private String extractConstructorArgs(final TypeElement typeElement) {

        final List<String> fields = typeElement.getEnclosedElements().stream()
                .filter(f -> f.getKind().isField())
                .filter(f -> !f.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(f -> format("%s?: %s", f.getSimpleName(), importStore.with(FIELD, new JavaType(f.asType(), declaredType).translate(decoratorStore)).toTypeScript(TYPE_ARGUMENT_USE)))
                .collect(toList());

        if (typeElement.getSuperclass().toString().equals("java.lang.Object")) {
            return fields.stream().collect(joining(", "));
        }

        final String inheritedFields = extractConstructorArgs((TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement());
        return Stream.concat(fields.stream(), Stream.of("inherited?: {" + inheritedFields + "}")).collect(joining(", "));
    }

    @Override
    public Set<DependencyRelation> getDependencies() {
        source.get();
        return importStore.getImports();
    }

    @Override
    public DeclaredType getType() {
        return declaredType;
    }
}
