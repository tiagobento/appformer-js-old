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
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;
import org.uberfire.jsbridge.tsexporter.meta.TranslatableJavaType;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;
import org.uberfire.jsbridge.tsexporter.util.Lazy;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.ENUM;
import static javax.lang.model.element.ElementKind.ENUM_CONSTANT;
import static javax.lang.model.element.ElementKind.INTERFACE;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;
import static org.uberfire.jsbridge.tsexporter.Utils.formatRightToLeft;
import static org.uberfire.jsbridge.tsexporter.Utils.lines;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;

public class PojoTsClass implements TsClass {

    private final DeclaredType declaredType;
    private final ImportStore importStore;
    private final Lazy<String> source;

    @Override
    public String toSource() {
        return source.get();
    }

    public PojoTsClass(final DeclaredType declaredType) {
        this.declaredType = declaredType;
        this.importStore = new ImportStore();
        this.source = new Lazy<>(() -> {
            if (getElement().getKind().equals(INTERFACE)) {
                return toInterface();
            } else if (getElement().getKind().equals(ENUM)) {
                return toEnum();
            } else {
                return toClass();
            }
        });
    }

    //FIXME: Enum extending interfaces?
    private String toEnum() {
        return formatRightToLeft(lines("",
                                       "enum s% { s% }",
                                       "",
                                       "export default s%;"),

                                 () -> extractSimpleName(TYPE_ARGUMENT_DECLARATION),
                                 this::enumFields,
                                 () -> extractSimpleName(TYPE_ARGUMENT_DECLARATION));
    }

    private String toInterface() {
        return formatRightToLeft(lines("",
                                       "s%",
                                       "",
                                       "export default interface s% s% {",
                                       "}"),

                                 this::imports,
                                 () -> extractSimpleName(TYPE_ARGUMENT_DECLARATION),
                                 this::interfaceHierarchy);
    }

    private String toClass() {
        return formatRightToLeft(lines("",
                                       "import { Portable } from 'generated__temporary__/Model';",
                                       "s%",
                                       "",
                                       "export default s% class s% s% {",
                                       "",
                                       "  protected readonly _fqcn: string = 's%';",
                                       "",
                                       "s%",
                                       "",
                                       "  constructor(self: { s% }) {",
                                       "    s%",
                                       "    Object.assign(this, self);",
                                       "  }",
                                       "}"),

                                 this::imports,
                                 this::abstractOrNot,
                                 () -> extractSimpleName(TYPE_ARGUMENT_DECLARATION),
                                 this::classHierarchy,
                                 this::fqcn,
                                 this::fields,
                                 () -> extractConstructorArgs(getElement()),
                                 this::superConstructorCall
        );
    }

    private String imports() {
        return importStore.getImportStatements(this);
    }

    private String extractSimpleName(final TsTypeTarget tsTypeTarget) {
        return importStore.with(new JavaType(getElement().asType(), getElement().asType()).translate(tsTypeTarget)).toTypeScript();
    }

    private String fqcn() {
        return getElement().getQualifiedName().toString();
    }

    private String enumFields() {
        return getElement().getEnclosedElements().stream()
                .filter(s -> s.getKind().equals(ENUM_CONSTANT))
                .map(Element::getSimpleName)
                .collect(joining(", "));
    }

    private String fields() {
        return getElement().getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(s -> format("public readonly %s?: %s;", s.getSimpleName(), importStore.with(new JavaType(s.asType(), declaredType).translate(TYPE_ARGUMENT_USE)).toTypeScript()))
                .collect(joining("\n"));
    }

    private TranslatableJavaType superclass() {
        return new JavaType(getElement().getSuperclass(), declaredType).translate(TYPE_ARGUMENT_USE);
    }

    private String superConstructorCall() {
        return superclass().canBeSubclassed() ? "super({...self.inherited});" : "";
    }

    private String classHierarchy() {
        final String _extends = superclass().canBeSubclassed()
                ? "extends " + importStore.with(superclass()).toTypeScript()
                : "";

        if (interfaces().isEmpty()) {
            return _extends + " " + format("implements Portable<%s>", extractSimpleName(TYPE_ARGUMENT_USE));
        } else {
            return _extends + " " + format("implements %s, %s",
                                           interfaces().stream()
                                                   .map(javaType -> importStore.with(javaType.translate(TYPE_ARGUMENT_USE)).toTypeScript())
                                                   .collect(joining(", ")),
                                           format("Portable<%s>", extractSimpleName(TYPE_ARGUMENT_USE)));
        }
    }

    private String abstractOrNot() {
        return getElement().getModifiers().contains(ABSTRACT) ? "abstract" : "";
    }

    private String interfaceHierarchy() {
        if (interfaces().isEmpty()) {
            return "";
        }

        return "extends " + interfaces().stream()
                .map(javaType -> importStore.with(javaType.translate(TYPE_ARGUMENT_USE)).toTypeScript())
                .collect(joining(", "));
    }

    private List<JavaType> interfaces() {
        return ((TypeElement) declaredType.asElement()).getInterfaces().stream()
                .map(t -> new JavaType(t, declaredType))
                .filter(s -> s.translate().canBeSubclassed())
                .collect(toList());
    }

    private String extractConstructorArgs(final TypeElement typeElement) {

        final List<String> fields = typeElement.getEnclosedElements().stream()
                .filter(f -> f.getKind().isField())
                .filter(f -> !f.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(f -> format("%s?: %s", f.getSimpleName(), importStore.with(new JavaType(f.asType(), declaredType).translate(TYPE_ARGUMENT_USE)).toTypeScript()))
                .collect(toList());

        if (typeElement.getSuperclass().toString().equals("java.lang.Object")) {
            return fields.stream().collect(joining(", "));
        }

        final String inheritedFields = extractConstructorArgs((TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement());
        return Stream.concat(fields.stream(), Stream.of("inherited?: {" + inheritedFields + "}")).collect(joining(", "));
    }

    @Override
    public List<DeclaredType> getDependencies() {
        source.get();
        return importStore.getImports(this);
    }

    @Override
    public DeclaredType getType() {
        return declaredType;
    }
}
