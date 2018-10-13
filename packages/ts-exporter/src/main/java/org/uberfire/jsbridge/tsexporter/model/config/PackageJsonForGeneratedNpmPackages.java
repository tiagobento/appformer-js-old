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

import java.util.HashSet;
import java.util.Set;

import org.uberfire.jsbridge.tsexporter.decorators.ImportEntryForDecorator;
import org.uberfire.jsbridge.tsexporter.decorators.ImportEntryForShadowedDecorator;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyRelation;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntry;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageGenerated;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.joining;
import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.FINAL;
import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.RAW;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PackageJsonForGeneratedNpmPackages implements TsExporterResource {

    private final NpmPackageGenerated npmPackage;

    public PackageJsonForGeneratedNpmPackages(final NpmPackageGenerated npmPackage) {
        this.npmPackage = npmPackage;
    }

    @Override
    public String toSource() {
        final Set<String> decoratorPackagesToInstallBeforeBuild = new HashSet<>();

        final String dependenciesPart = npmPackage.getClasses().stream()
                .flatMap(clazz -> clazz.getDependencies().stream())
                .map(DependencyRelation::getImportEntry)
                .map(importEntry -> {
                    if (npmPackage.getType().equals(FINAL) || !(importEntry instanceof ImportEntryForDecorator)) {
                        return importEntry;
                    }

                    decoratorPackagesToInstallBeforeBuild.add(importEntry.getNpmPackageName());
                    return new ImportEntryForShadowedDecorator((ImportEntryForDecorator) importEntry);
                })
                .collect(groupingBy(ImportEntry::getNpmPackageName))
                .keySet().stream()
                .filter(name -> !name.equals(npmPackage.getName()))
                .filter(name -> !name.contains("appformer-js"))
                .sorted()
                .map(name -> format("\"%s\": \"%s\"", name, npmPackage.getVersion()))
                .collect(joining(",\n"));

        final String installDecoratorsPart = "";
//        decoratorPackagesToInstallBeforeBuild.isEmpty()
//                ? ""
//                : (" yarn add " + decoratorPackagesToInstallBeforeBuild.stream().collect(joining(" ")) + " -W --no-lockfile --registry http://localhost:4873 && ");

        final String version = npmPackage.getVersion() + (npmPackage.getType().equals(RAW) ? "-raw" : "");

        return format(lines("{",
                            "  \"name\": \"%s\",",
                            "  \"version\": \"%s\",",
                            "  \"license\": \"Apache-2.0\",",
                            "  \"main\": \"./dist/index.js\",",
                            "  \"types\": \"./dist/index.d.ts\",",
                            "  \"publishConfig\": {\"registry\": \"http://localhost:4873\"},",
                            "  \"dependencies\": {",
                            "%s",
                            "  },",
                            "  \"scripts\": {",
                            "    \"build:ts-exporter\": \"" + installDecoratorsPart + " npx webpack && yarn run doUnpublish && yarn run doPublish\",",
                            "    \"doUnpublish\": \"npm unpublish --force --registry http://localhost:4873 || echo 'Was not published'\",",
                            "    \"doPublish\": \"%s\"",
                            "  }",
                            "}"),

                      getNpmPackageName(),
                      version,
                      dependenciesPart,
                      npmPackage.getType().equals(FINAL)
                              ? "echo 'Skipping publish'"
                              : ("yarn publish --new-version " + version)
        );
    }

    @Override
    public String getNpmPackageName() {
        return npmPackage.getName() + (npmPackage.getType().equals(FINAL) ? "-final" : "");
    }
}
