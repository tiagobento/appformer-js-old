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

import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorPackageResource;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorsNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.GeneratedNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.config.LernaJson;
import org.uberfire.jsbridge.tsexporter.model.config.PackageJson1stLayer;

import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.RAW;
import static org.uberfire.jsbridge.tsexporter.model.TsClass.PACKAGES_SCOPE;

public class TsCodegenResult {

    private final DecoratorStore decoratorStore;
    private final Set<GeneratedNpmPackage> npmPackages;
    private final String version;

    public TsCodegenResult(final String version,
                           final DecoratorStore decoratorStore,
                           final Set<GeneratedNpmPackage> npmPackages) {

        this.version = version;
        this.decoratorStore = decoratorStore;
        this.npmPackages = npmPackages;
    }

    private Map<String, GeneratedNpmPackage> generatedNpmPackagesByName() {
        return npmPackages.stream()
                .collect(toMap(GeneratedNpmPackage::getNpmPackageName,
                               identity(),
                               (a, b) -> a.getType().equals(RAW) ? b : a));
    }

    public Set<GeneratedNpmPackage> getNpmPackages() {
        return npmPackages;
    }

    public TsExporterResource getRootPackageJson() {
        return new PackageJson1stLayer();
    }

    public TsExporterResource getLernaJson() {
        return new LernaJson(version);
    }

    public String getDecoratorsNpmPackageName(final GeneratedNpmPackage npmPackage) {
        return decoratorStore.getDecoratorsNpmPackageNameFor(npmPackage);
    }

    public Map<GeneratedNpmPackage, DecoratorsNpmPackage> getDecoratorsNpmPackagesByDecoratedNpmPackages() {
        return decoratorStore.getDecoratorNpmPackageNamesByDecoratedMvnModuleNames().entrySet().stream()
                .collect(toMap(e -> generatedNpmPackagesByName().get(PACKAGES_SCOPE + "/" + e.getKey()), e -> {
                    final Set<DecoratorPackageResource> resources = new Reflections(e.getValue(), new ResourcesScanner())
                            .getResources(Pattern.compile(".*")).stream()
                            .filter(resourceName -> !resourceName.contains("/node_modules/"))
                            .filter(resourceName -> !resourceName.contains("/dist/"))
                            .map(resourceName -> new DecoratorPackageResource(e.getValue(), resourceName))
                            .collect(toSet());

                    return new DecoratorsNpmPackage(e.getValue(), version, resources);
                }));
    }
}
