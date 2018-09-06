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

import org.uberfire.jsbridge.tsexporter.meta.dependency.Dependency;
import org.uberfire.jsbridge.tsexporter.model.TsClass;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static org.uberfire.jsbridge.tsexporter.Utils.lines;

public class PackageJson {

    private final String moduleName;
    private final List<? extends TsClass> classes;

    public PackageJson(final String moduleName,
                       final List<? extends TsClass> classes) {

        this.moduleName = moduleName;
        this.classes = classes;
    }

    public String toSource() {

        final String dependencies = classes.stream()
                .flatMap(c -> c.getDependencies().stream())
                .collect(groupingBy(Dependency::getModuleName))
                .keySet().stream()
                .filter(s -> !s.equals(moduleName))
                .map(moduleName -> format("\"%s\": \"file:../%s\"", moduleName, moduleName))
                .collect(joining(",\n"));

        return format(lines("{",
                            "  \"name\": \"%s\",",
                            "  \"version\": \"%s\",",
                            "  \"private\": true,",
                            "  \"license\": \"Apache-2.0\",",
                            "  \"dependencies\": {",
                            "%s",
                            "  }",
                            "}"),

                      moduleName,
                      "1.0.0",
                      dependencies
        );
    }

    public String getModuleName() {
        return moduleName;
    }
}
