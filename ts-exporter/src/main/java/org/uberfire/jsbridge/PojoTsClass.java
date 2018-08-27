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
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.ElementKind.ENUM;
import static javax.lang.model.element.ElementKind.ENUM_CONSTANT;
import static javax.lang.model.element.ElementKind.INTERFACE;
import static javax.lang.model.element.Modifier.ABSTRACT;
import static javax.lang.model.element.Modifier.STATIC;

public class PojoTsClass {

    private final PortablePojoModule portablePojoModule;
    private final ImportStore importStore;

    public PojoTsClass(final PortablePojoModule portablePojoModule) {
        this.portablePojoModule = portablePojoModule;
        this.importStore = new ImportStore();
    }

    public String toSource() {

        final Element element = portablePojoModule.getType().asElement();

        if (element.getKind().equals(INTERFACE)) {
            return generateInterface();
        }

        if (element.getKind().equals(ENUM)) {
            return generateEnum();
        }

        return generateClass();
    }

    private String generateClass() {
        final DeclaredType type = portablePojoModule.getType();
        final TypeElement element = (TypeElement) type.asElement();
        final String simpleName = extractSimpleName(element);

        final List<JavaType> implementedInterfaces = extractInterfaces();

        final String fields = element.getEnclosedElements().stream()
                .filter(s -> s.getKind().isField())
                .filter(s -> !s.getModifiers().contains(STATIC))
                .map(s -> format("  public readonly %s?: %s;", s.getSimpleName(), importStore.importing(new JavaType(s.asType(), type)).toUniqueTsType()))
                .collect(joining("\n"));

        final String constructorArgs = extractConstructorArgs(element);

        final String superCall = element.getSuperclass().toString().matches("^javax?.*")
                ? ""
                : "super({...self.inherited});";

        final String _implements = implementedInterfaces.isEmpty()
                ? format("implements Portable<%s>", simpleName)
                : "implements " + implementedInterfaces.stream().peek(importStore::importing).map(JavaType::toUniqueTsType).collect(joining(", ")) + format(", Portable<%s>", simpleName);

        final String _extends = element.getSuperclass().toString().matches("^javax?.*")
                ? ""
                : "extends " + importStore.importing(new JavaType(element.getSuperclass(), type)).toUniqueTsType();

        final String hierarchy = _extends + " " + _implements;
        final String abstractOrNot = element.getModifiers().contains(ABSTRACT) ? "abstract" : "";

        //Has to be the last.
        final String imports = importStore.getImportStatements();

        return format("" +
                              "import { Portable } from \"generated/Model\";" +
                              "\n" +
                              "%s" +
                              "\n" +
                              "\n" +
                              "export default %s class %s %s {" +
                              "\n" +
                              "\n" +
                              "  protected readonly _fqcn: string = \"%s\";" +
                              "\n" +
                              "\n" +
                              "%s" +
                              "\n" +
                              "\n" +
                              "  constructor(self: { %s }) {" +
                              "\n" +
                              "    %s" +
                              "\n" +
                              "    Object.assign(this, self); " +
                              "\n" +
                              "  }" +
                              "\n" +
                              "}",

                      imports,
                      abstractOrNot,
                      simpleName,
                      hierarchy,
                      portablePojoModule.getOriginatingFqcn(),
                      fields,
                      constructorArgs,
                      superCall
        );
    }

    private String generateEnum() {
        final TypeElement element = (TypeElement) portablePojoModule.getType().asElement();
        final String simpleName = extractSimpleName(element);

        //FIXME: Enum extending interfaces?
        final String enumFields = element.getEnclosedElements().stream()
                .filter(s -> s.getKind().equals(ENUM_CONSTANT))
                .map(Element::getSimpleName)
                .collect(joining(", "));

        return format("" +
                              "enum %s { %s }" +
                              "\n" +
                              "\n" +
                              "export default %s;",

                      simpleName,
                      enumFields,
                      simpleName);
    }

    private String generateInterface() {
        final List<JavaType> implementedInterfaces = extractInterfaces();
        final DeclaredType type = portablePojoModule.getType();
        final TypeElement element = (TypeElement) type.asElement();
        final String simpleName = extractSimpleName(element);
        final String _implements = implementedInterfaces.isEmpty()
                ? ""
                : "extends " + implementedInterfaces.stream().peek(importStore::importing).map(JavaType::toUniqueTsType).collect(joining(", "));

        //Has to be the last
        final String imports = importStore.getImportStatements();

        return format("" +
                              "%s" +
                              "\n" +
                              "\n" +
                              "export default interface %s %s {" +
                              "\n" +
                              "}",

                      imports,
                      simpleName,
                      _implements);
    }

    private List<JavaType> extractInterfaces() {
        final DeclaredType type = portablePojoModule.getType();
        final TypeElement element = (TypeElement) type.asElement();
        return element.getInterfaces().stream()
                .map(t -> new JavaType(t, type))
                .filter(t -> !t.getFlatFqcn().matches("^javax?.*"))
                .collect(toList());
    }

    private String extractSimpleName(final TypeElement element) {
        final String fqcn = new JavaType(element.asType(), element.asType()).toUniqueTsType();
        return fqcn.substring(fqcn.indexOf(element.getSimpleName().toString()));
    }

    private String extractConstructorArgs(final TypeElement typeElement) {

        final List<String> fields = typeElement.getEnclosedElements().stream()
                .filter(f -> f.getKind().isField())
                .filter(f -> !f.getModifiers().contains(STATIC))
                .map(f -> format("%s?: %s", f.getSimpleName(), importStore.importing(new JavaType(f.asType(), typeElement.asType())).toUniqueTsType()))
                .collect(toList());

        if (typeElement.getSuperclass().toString().equals("java.lang.Object")) {
            return fields.stream().collect(joining(", "));
        }

        final String inheritedFields = extractConstructorArgs((TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement());
        return Stream.concat(fields.stream(), Stream.of("inherited?: {" + inheritedFields + "}")).collect(joining(", "));
    }

    public List<PortablePojoModule> getDependencies() {
        return importStore.getImports();
    }
}
