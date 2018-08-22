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
import java.util.Map;

import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.lang.model.type.TypeVariable;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static org.uberfire.jsbridge.RemoteTsExporter.getTypeElement;

public class JavaMethod {

    public final ExecutableElement executableElement;

    public JavaMethod(final ExecutableElement executableElement) {
        this.executableElement = executableElement;
    }

    public String toErraiBusPath() {
        return this.executableElement.getSimpleName() + ":" + getParametersString().stream().collect(joining(":"));
    }

    public Map<String, String> getParameters() {
        return this.executableElement.getParameters().stream()
                .collect(toMap(s -> s.getSimpleName().toString(),
                               s -> getParameterType(s)));
    }

    private List<String> getParametersString() {
        return this.executableElement.getParameters().stream()
                .map(this::getParameterType)
                .collect(toList());
    }

    private String getParameterType(final VariableElement p) {
        try {
            return ((TypeElement) getTypeElement(p)).getQualifiedName().toString();
        } catch (final Exception e) {
            return getTypeElement(p).toString();
        }
    }

    public String getName() {
        return executableElement.getSimpleName().toString();
    }
}
