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

import org.uberfire.jsbridge.tsexporter.decorators.ImportEntryForDecorator;
import org.uberfire.jsbridge.tsexporter.decorators.ImportEntryForShadowedDecorator;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntry;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageGenerated;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PackageJsonForAggregationNpmPackage implements TsExporterResource {

    private final NpmPackageGenerated npmPackage;
    private final String decoratorsNpmPackageName;

    public PackageJsonForAggregationNpmPackage(final NpmPackageGenerated npmPackage,
                                               final String decoratorsNpmPackageName) {

        this.npmPackage = npmPackage;
        this.decoratorsNpmPackageName = decoratorsNpmPackageName;
    }

    @Override
    public String toSource() {
        final String dependenciesPart = npmPackage.getClasses().stream()
                .flatMap(clazz -> clazz.getDependencies().stream())
                .map(DependencyRelation::getImportEntry)
                .map(importEntry -> importEntry instanceof ImportEntryForDecorator
                        ? new ImportEntryForShadowedDecorator((ImportEntryForDecorator) importEntry)
                        : importEntry)
                .collect(groupingBy(ImportEntry::getNpmPackageName))
                .keySet().stream()
                .filter(name -> !name.equals(npmPackage.getName()))
                .filter(name -> !name.contains("appformer-js"))
                .sorted()
                .map(name -> format("\"%s\": \"%s\"", name, npmPackage.getVersion()))
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
                "    \"build\": \"npm i --no-package-lock && npx lerna bootstrap && npx lerna exec -- npm run build && npm i " + decoratorsNpmPackageName + " --registry http://localhost:4873 && npm run doUnpublish && npm run doPublish\",",
                "    \"doUnpublish\": \"npm unpublish --force --registry http://localhost:4873 || echo 'Was not published'\",",
                "    \"doPublish\": \"mv dist dist.tmp && mv `readlink dist.tmp` . && rm dist.tmp && npm publish --registry http://localhost:4873\"",
                "  },",
                "  \"devDependencies\": {",
                "    \"circular-dependency-plugin\": \"^5.0.2\",",
                "    \"clean-webpack-plugin\": \"^0.1.19\",",
                "    \"ts-loader\": \"^4.4.2\",",
                "    \"typescript\": \"^2.9.2\",",
                "    \"webpack\": \"^4.15.1\",",
                "    \"webpack-cli\": \"^3.0.8\",",
                "    \"lerna\": \"^3.4.0\"",
                "  }",
                "}"),

                      npmPackage.getName(),
                      npmPackage.getVersion(),
                      dependenciesPart

        );
    }

    @Override
    public String getNpmPackageName() {
        return npmPackage.getName();
    }
}
