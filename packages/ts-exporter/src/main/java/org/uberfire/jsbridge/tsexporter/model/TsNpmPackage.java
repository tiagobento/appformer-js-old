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

import java.util.Set;

import org.uberfire.jsbridge.tsexporter.model.config.IndexTs;
import org.uberfire.jsbridge.tsexporter.model.config.PackageJson;
import org.uberfire.jsbridge.tsexporter.model.config.TsConfigJson;
import org.uberfire.jsbridge.tsexporter.model.config.WebpackConfigJs;

import static org.uberfire.jsbridge.tsexporter.model.TsNpmPackage.Type.FINAL;

public class TsNpmPackage {

    private final String npmPackageName;
    private final Set<? extends TsClass> classes;
    private final String version;
    private final Type type;

    public String getVersion() {
        return version;
    }

    public enum Type {
        RAW,
        FINAL,
        UNDECORATED;
    }

    public TsNpmPackage(final String npmPackageName,
                        final Set<? extends TsClass> classes,
                        final String version,
                        final Type type) {

        this.npmPackageName = npmPackageName;
        this.classes = classes;
        this.version = version;
        this.type = type;
    }

    public Set<? extends TsClass> getClasses() {
        return classes;
    }

    public String getNpmPackageName() {
        return npmPackageName;
    }

    public IndexTs getIndexTs() {
        return new IndexTs(npmPackageName, classes);
    }

    public WebpackConfigJs getWebpackConfigJs() {
        return new WebpackConfigJs(npmPackageName);
    }

    public TsConfigJson getTsConfigJson() {
        return new TsConfigJson(npmPackageName);
    }

    public PackageJson getPackageJson() {
        return new PackageJson(version, npmPackageName + (type.equals(FINAL) ? "-final" : ""), classes);
    }

    public String getUnscopedNpmPackageName() {
        return getWebpackConfigJs().getUnscopedNpmPackageName();
    }

    public Type getType() {
        return type;
    }
}
