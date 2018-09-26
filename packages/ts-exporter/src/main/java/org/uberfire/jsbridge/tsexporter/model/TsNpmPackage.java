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
import java.util.Set;
import java.util.stream.Stream;

import org.uberfire.jsbridge.tsexporter.model.config.IndexTs;
import org.uberfire.jsbridge.tsexporter.model.config.PackageJson;
import org.uberfire.jsbridge.tsexporter.model.config.TsConfigJson;
import org.uberfire.jsbridge.tsexporter.model.config.WebpackConfigJs;

import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;
import static org.uberfire.jsbridge.tsexporter.model.TsClass.PACKAGES_SCOPE;

public class TsNpmPackage {

    private final String npmPackageName;
    private final List<? extends TsClass> classes;

    public TsNpmPackage(final String npmPackageName,
                        final List<? extends TsClass> classes) {

        this.npmPackageName = npmPackageName;
        this.classes = classes;
    }

    public List<? extends TsClass> getClasses() {
        return classes;
    }

    public String getNpmPackageName() {
        return npmPackageName;
    }

    public IndexTs getIndexTs() {
        return new IndexTs(npmPackageName, classes);
    }

    public WebpackConfigJs getWebpackConfigJs() {
        return new WebpackConfigJs(npmPackageName, classes);
    }

    public TsConfigJson getTsConfigJson() {
        return new TsConfigJson(npmPackageName, classes);
    }

    public PackageJson getPackageJson() {
        return new PackageJson(npmPackageName, classes);
    }

    public Set<String> getGeneratedDependenciesNpmPackageNames() {
        return concat(Stream.of(npmPackageName),
                      getPackageJson().getDependenciesNpmPackageNames().stream())
                .filter(npmPackageName -> npmPackageName.startsWith(PACKAGES_SCOPE))
                .collect(toSet());
    }

    public String getUnscopedNpmPackageName() {
        return getPackageJson().getUnscopedNpmPackageName();
    }
}
