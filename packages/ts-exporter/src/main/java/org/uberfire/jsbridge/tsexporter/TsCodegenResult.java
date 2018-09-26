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

package org.uberfire.jsbridge.tsexporter;

import java.util.Set;
import java.util.stream.Collectors;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.config.LernaJson;
import org.uberfire.jsbridge.tsexporter.model.config.RootPackageJson;

import static java.util.stream.Collectors.toSet;

public class TsCodegenResult {

    private final Set<TsNpmPackage> npmPackages;
    private final DecoratorStore decoratorStore;

    public TsCodegenResult(final DecoratorStore decoratorStore, final Set<TsNpmPackage> npmPackages) {

        this.npmPackages = npmPackages;
        this.decoratorStore = decoratorStore;
    }

    public Set<TsNpmPackage> getTsNpmPackages() {
        return npmPackages;
    }

    public TsExporterResource getRootPackageJson() {
        return new RootPackageJson();
    }

    public TsExporterResource getLernaJson() {
        return new LernaJson();
    }

    public Set<TsNpmPackage> getTsNpmPackagesWhichHaveDecorators() {
        return getTsNpmPackages().stream()
                .filter(npmPackage -> decoratorStore.getNpmPackageNamesWhichHaveDecorators().contains(npmPackage.getUnscopedNpmPackageName()))
                .collect(toSet());
    }
}
