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

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.Utils;
import org.uberfire.jsbridge.tsexporter.meta.dependency.Dependency;

public interface TsClass {

    String toSource();

    default String getModuleName() {
        return Utils.getModuleName(getType());
    }

    List<Dependency> getDependencies();

    DeclaredType getType();

    default TypeElement asElement() {
        return ((TypeElement) getType().asElement());
    }

    default String getRelativePath() {
        return asElement().getQualifiedName().toString().replace(".", "/");
    }
}
