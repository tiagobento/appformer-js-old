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

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.ArrayType;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.ExecutableType;
import javax.lang.model.type.PrimitiveType;
import javax.lang.model.type.TypeKind;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.type.WildcardType;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;

import org.uberfire.jsbridge.tsexporter.Main;

import static java.util.stream.Collectors.toList;

public class TestingUtils {

    public static Types types;
    public static Elements elements;

    public static void init(final Types types, final Elements elements) {
        TestingUtils.types = Main.types = types;
        TestingUtils.elements = Main.elements = elements;
    }

    public static WildcardType wildcard(final TypeMirror extendsBound, final TypeMirror superBound) {
        return types.getWildcardType(extendsBound, superBound);
    }

    public static PrimitiveType primitive(final TypeKind kind) {
        return types.getPrimitiveType(kind);
    }

    public static ArrayType array(final TypeMirror type) {
        return types.getArrayType(type);
    }

    public static TypeMirror erased(final TypeMirror type) {
        return types.erasure(type);
    }

    public static DeclaredType type(final Class<?> clazz) {
        return (DeclaredType) elements.getTypeElement(clazz.getCanonicalName()).asType();
    }

    public static JavaType member(final String name, final TypeMirror owner) {
        final TypeMirror member = elements.getAllMembers((TypeElement) types.asElement(owner)).stream()
                .filter(s -> s.getSimpleName().toString().equals(name))
                .collect(toList())
                .get(0)
                .asType();

        return new JavaType(member, owner);
    }

    public static JavaType param(final int i, final JavaType owner) {
        return new JavaType(((ExecutableType) owner.getType()).getParameterTypes().get(i), owner.owner);
    }
}
