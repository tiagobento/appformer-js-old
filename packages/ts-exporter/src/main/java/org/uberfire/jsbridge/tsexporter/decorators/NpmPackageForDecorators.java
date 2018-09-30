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

package org.uberfire.jsbridge.tsexporter.decorators;

import java.util.Set;
import java.util.regex.Pattern;

import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageGenerated;
import org.uberfire.jsbridge.tsexporter.model.NpmPackage;

import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.DECORATORS;

public class NpmPackageForDecorators implements NpmPackage {

    private final String name;
    private final String version;
    private final Set<DecoratorPackageResource> resources;

    public NpmPackageForDecorators(final String name,
                                   final String version) {

        this.name = name;
        this.version = version;
        this.resources = new Reflections(name, new ResourcesScanner()).getResources(Pattern.compile(".*")).stream()
                .filter(resourceName -> !resourceName.contains("/node_modules/"))
                .filter(resourceName -> !resourceName.contains("/dist/"))
                .map(resourceName -> new DecoratorPackageResource(name, resourceName))
                .collect(toSet());
    }

    @Override
    public String getVersion() {
        return version;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getUnscopedNpmPackageName() {
        return name;
    }

    @Override
    public NpmPackageGenerated.Type getType() {
        return DECORATORS;
    }

    public Set<DecoratorPackageResource> getResources() {
        return resources;
    }
}
