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

import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;

import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class NpmIgnore implements TsExporterResource {

    private final TsNpmPackage tsNpmPackage;

    public NpmIgnore(final TsNpmPackage tsNpmPackage) {
        this.tsNpmPackage = tsNpmPackage;
    }

    @Override
    public String toSource() {
        return lines(
                "**/packages",
                "**/lerna.json"
        );
    }

    @Override
    public String getNpmPackageName() {
        return tsNpmPackage.getNpmPackageName();
    }
}
