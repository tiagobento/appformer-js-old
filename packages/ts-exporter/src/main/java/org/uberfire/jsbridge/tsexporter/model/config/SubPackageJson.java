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

package org.uberfire.jsbridge.tsexporter.model.config;

import java.util.Set;

import org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntry;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class SubPackageJson implements TsExporterResource {

    private final String npmPackageName;
    private final String version;
    private final String decoratorsNpmPackageName;
    private final Set<? extends TsClass> dependencies;

    public SubPackageJson(final String npmPackageName,
                          final String version,
                          final String decoratorsNpmPackageName,
                          final Set<? extends TsClass> dependencies) {

        this.npmPackageName = npmPackageName;
        this.version = version;
        this.decoratorsNpmPackageName = decoratorsNpmPackageName;
        this.dependencies = dependencies;
    }

    @Override
    public String toSource() {
        final String dependenciesPart = dependencies.stream()
                .flatMap(clazz -> clazz.getDependencies().stream())
                .map(DependencyRelation::getImportEntry)
                .collect(groupingBy(ImportEntry::getNpmPackageName))
                .keySet().stream()
                .filter(name -> !name.equals(npmPackageName))
                .sorted()
                .map(name -> format("\"%s\": \"%s\"", name, version))
                .collect(joining(",\n"));

        return format(lines(
                "{",
                "  \"name\": \"%s\",",
                "  \"version\": \"%s\",",
                "  \"license\": \"Apache-2.0\",",
                "  \"main\": \"./dist/index.js\",",
                "  \"types\": \"./dist/index.d.ts\",",
                "  \"dependencies\": {",
                "%s",
                "  },",
                "  \"scripts\": {",
                "    \"build\": \"npm i --no-package-lock && npx lerna bootstrap && npx lerna run build && npm run doUnpublish && npm run doPublish\",",
                "    \"doUnpublish\": \"npm unpublish --force --registry http://localhost:4873 || echo 'Was not published'\",",
                "    \"doPublish\": \"npm publish --registry http://localhost:4873\"",
                "  },",
                "  \"devDependencies\": {",
                "    \"appformer-js\": \"^1.0.0\",",
                "    \"circular-dependency-plugin\": \"^5.0.2\",",
                "    \"clean-webpack-plugin\": \"^0.1.19\",",
                "    \"ts-loader\": \"^4.4.2\",",
                "    \"typescript\": \"^2.9.2\",",
                "    \"webpack\": \"^4.15.1\",",
                "    \"webpack-cli\": \"^3.0.8\",",
                "    \"lerna\": \"^3.4.0\"",
                "  }",
                "}"),

                      npmPackageName,
                      version,
                      dependenciesPart

        );
    }

    @Override
    public String getNpmPackageName() {
        return npmPackageName;
    }
}
