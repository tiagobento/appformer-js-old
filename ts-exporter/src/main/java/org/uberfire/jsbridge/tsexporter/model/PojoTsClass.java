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
import java.util.Optional;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.meta.ImportableJavaType;
import org.uberfire.jsbridge.tsexporter.meta.ImportableTsType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.ENUM;
import static javax.lang.model.element.ElementKind.ENUM_CONSTANT;
import static javax.lang.model.element.ElementKind.INTERFACE;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;
import static org.uberfire.jsbridge.tsexporter.Utils.lines;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;

public class PojoTsClass {

    private final ImportableTsType importableTsType;
    private final ImportStore importStore;

    public PojoTsClass(final ImportableTsType importableTsType) {
        this.importableTsType = importableTsType;
        this.importStore = new ImportStore();
    }

    public String toSource() {

        final Element element = importableTsType.getType().asElement();

        if (element.getKind().equals(INTERFACE)) {
            return generateInterface();
        }

        if (element.getKind().equals(ENUM)) {
            return generateEnum();
        }

        return generateClass();
    }

    private String generateClass() {
        final DeclaredType type = importableTsType.getType();
        final TypeElement element = (TypeElement) type.asElement();
        final String simpleName = extractSimpleName(element, TYPE_ARGUMENT_DECLARATION);

        final Optional<ImportableTsType> importableSuperclassTsType = new JavaType(element.getSuperclass(), type)
                .asImportableJavaType()
                .flatMap(ImportableJavaType::asImportableTsType);

        final List<JavaType> implementedInterfaces = extractInterfaces();

        final String fields = element.getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(s -> format("public readonly %s?: %s;", s.getSimpleName(), importStore.importing(new JavaType(s.asType(), type)).toUniqueTsType(TYPE_ARGUMENT_USE)))
                .collect(joining("\n"));

        final String constructorArgs = extractConstructorArgs(element);

        final String _extends = importableSuperclassTsType.map(t -> "extends " + importStore.importing(t).toUniqueTsType(TYPE_ARGUMENT_USE)).orElse("");

        final String _implements = implementedInterfaces.isEmpty()
                ? format("implements Portable<%s>", extractSimpleName(element, TYPE_ARGUMENT_USE))
                : "implements " + implementedInterfaces.stream().peek(importStore::importing).map(javaType -> javaType.toUniqueTsType(TYPE_ARGUMENT_USE)).collect(joining(", ")) + format(", Portable<%s>", extractSimpleName(element, TYPE_ARGUMENT_USE));

        //Has to be the last.
        final String imports = importStore.getImportStatements();

        return format(lines("",
                            "import { Portable } from 'generated__temporary__/Model';",
                            "%s",
                            "",
                            "export default %s class %s %s {",
                            "",
                            "  protected readonly _fqcn: string = '%s';",
                            "",
                            "%s",
                            "",
                            "  constructor(self: { %s }) {",
                            "    %s",
                            "    Object.assign(this, self); ",
                            "  }",
                            "}"),

                      imports,
                      element.getModifiers().contains(ABSTRACT) ? "abstract" : "",
                      simpleName,
                      _extends + " " + _implements,
                      importableTsType.getCanonicalFqcn(),
                      fields,
                      constructorArgs,
                      importableSuperclassTsType.map(t -> "super({...self.inherited});").orElse("")
        );
    }

    private String generateEnum() {
        final TypeElement element = (TypeElement) importableTsType.getType().asElement();
        final String simpleName = extractSimpleName(element, TYPE_ARGUMENT_DECLARATION);

        //FIXME: Enum extending interfaces?
        final String enumFields = element.getEnclosedElements().stream()
                .filter(s -> s.getKind().equals(ENUM_CONSTANT))
                .map(Element::getSimpleName)
                .collect(joining(", "));

        return format(lines("",
                            "enum %s { %s }",
                            "",
                            "export default %s;"),

                      simpleName,
                      enumFields,
                      simpleName);
    }

    private String generateInterface() {
        final List<JavaType> implementedInterfaces = extractInterfaces();
        final DeclaredType type = importableTsType.getType();
        final TypeElement element = (TypeElement) type.asElement();
        final String simpleName = extractSimpleName(element, TYPE_ARGUMENT_DECLARATION);
        final String _implements = !implementedInterfaces.isEmpty()
                ? "extends " + implementedInterfaces.stream().peek(importStore::importing).map(javaType -> javaType.toUniqueTsType(TYPE_ARGUMENT_USE)).collect(joining(", "))
                : "";

        //Has to be the last
        final String imports = importStore.getImportStatements();

        return format(lines("",
                            "%s",
                            "",
                            "export default interface %s %s {",
                            "}"),

                      imports,
                      simpleName,
                      _implements);
    }

    private List<JavaType> extractInterfaces() {
        final DeclaredType type = importableTsType.getType();
        final TypeElement element = (TypeElement) type.asElement();
        return element.getInterfaces().stream()
                .map(t -> new JavaType(t, t).asImportableJavaType())
                .map(t -> t.flatMap(ImportableJavaType::asImportableTsType))
                .filter(Optional::isPresent).map(Optional::get)
                .collect(toList());
    }

    private String extractSimpleName(final TypeElement element, final TsTypeTarget tsTypeTarget) {
        final String fqcn = importStore.importing(new JavaType(element.asType())).toUniqueTsType(tsTypeTarget);
        return fqcn.substring(fqcn.indexOf(element.getSimpleName().toString()));
    }

    private String extractConstructorArgs(final TypeElement typeElement) {

        final List<String> fields = typeElement.getEnclosedElements().stream()
                .filter(f -> f.getKind().isField())
                .filter(f -> !f.getModifiers().contains(STATIC))
                .filter(s -> !s.asType().toString().contains("java.util.function"))
                .map(f -> format("%s?: %s", f.getSimpleName(), importStore.importing(new JavaType(f.asType(), importableTsType.getType())).toUniqueTsType(TYPE_ARGUMENT_USE)))
                .collect(toList());

        if (typeElement.getSuperclass().toString().equals("java.lang.Object")) {
            return fields.stream().collect(joining(", "));
        }

        final String inheritedFields = extractConstructorArgs((TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement());
        return Stream.concat(fields.stream(), Stream.of("inherited?: {" + inheritedFields + "}")).collect(joining(", "));
    }

    public List<ImportableTsType> getDependencies() {
        return importStore.getImports();
    }
}
