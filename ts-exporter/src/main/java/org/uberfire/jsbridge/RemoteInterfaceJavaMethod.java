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

import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;

import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static org.uberfire.jsbridge.RemoteTsExporter.distinctBy;

public class RemoteInterfaceJavaMethod {

    private final ExecutableElement executableElement;
    private final TypeElement _interface;

    public RemoteInterfaceJavaMethod(final TypeElement _interface, final ExecutableElement executableElement) {
        this.executableElement = executableElement;
        this._interface = _interface;
    }

    public String toErraiBusPath() {
        final List<String> parameterFqcns = executableElement.getParameters().stream()
                .map(Element::asType)
                .map(Object::toString)
                .collect(toList());
        return executableElement.getSimpleName() + ":" + parameterFqcns.stream().collect(joining(":"));
    }

    public String getName() {
        return executableElement.getSimpleName().toString();
    }

    public JavaType getReturnType() {
        return new JavaType(executableElement.getReturnType(), _interface.asType());
    }

    public LinkedHashMap<String, JavaType> getParameterJavaTypesByNames() {
        return this.executableElement.getParameters().stream().collect(
                toMap(arg -> arg.getSimpleName().toString(),
                      arg -> new JavaType(arg.asType(), _interface.asType()),
                      (a, b) -> b, //default map behavior
                      LinkedHashMap::new));
    }

    public List<ImportableJavaType> getParameterDirectTsDependencies() {
        return executableElement.getParameters().stream()
                .flatMap(arg -> new JavaType(arg.asType(), _interface.asType()).getDirectImportableNonJdkTypes().stream())
                .filter(distinctBy(JavaType::getFlatFqcn))
                .collect(toList());
    }

    public List<ImportableJavaType> getAllTsDependenciesOfReturnType() {
        return new JavaType(executableElement.getReturnType(), _interface.asType()).asImportableJavaType()
                .map(importableJavaType -> importableJavaType.getAllTsImportableTypes(new HashSet<>()))
                .orElseGet(Collections::emptyList);
    }
}
