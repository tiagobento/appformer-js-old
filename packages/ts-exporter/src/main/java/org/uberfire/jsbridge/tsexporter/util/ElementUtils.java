package org.uberfire.jsbridge.tsexporter.util;

import java.util.List;
import java.util.stream.Stream;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import static java.util.stream.Collectors.toList;
import static javax.lang.model.element.Modifier.STATIC;

public final class ElementUtils {

    public static List<Element> getAllNonStaticFields(final TypeElement typeElement) {

        final List<Element> currentTypeFields = nonStaticFieldsIn(typeElement.getEnclosedElements());

        if (typeElement.getSuperclass().toString().equals("java.lang.Object")) {
            return currentTypeFields;
        }

        final TypeElement superElement = (TypeElement) ((DeclaredType) typeElement.getSuperclass()).asElement();
        final List<Element> inheritedTypeFields = getAllNonStaticFields(superElement);

        return Stream.concat(inheritedTypeFields.stream(), currentTypeFields.stream()).collect(toList());
    }

    public static List<Element> nonStaticFieldsIn(final List<? extends Element> elements) {
        return elements.stream()
                .filter(e -> e.getKind().isField())
                .filter(e -> !e.getModifiers().contains(STATIC))
                .filter(e -> !e.asType().toString().contains("java.util.function"))
                .collect(toList());
    }
}
