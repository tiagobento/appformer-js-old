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

import org.uberfire.jsbridge.tsexporter.model.GeneratedNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.NpmPackage;

import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.DECORATORS;

public class DecoratorsNpmPackage implements NpmPackage {

    private final String name;
    private final String version;
    private final Set<DecoratorPackageResource> resources;

    public DecoratorsNpmPackage(final String name,
                                final String version,
                                final Set<DecoratorPackageResource> resources) {
        this.name = name;
        this.version = version;
        this.resources = resources;
    }

    @Override
    public String getVersion() {
        return version;
    }

    @Override
    public String getNpmPackageName() {
        return name;
    }

    @Override
    public String getUnscopedNpmPackageName() {
        return name;
    }

    @Override
    public GeneratedNpmPackage.Type getType() {
        return DECORATORS;
    }

    public Set<DecoratorPackageResource> getResources() {
        return resources;
    }
}
