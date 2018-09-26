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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;

import static java.io.File.separator;
import static java.lang.String.format;
import static java.lang.System.getProperty;
import static org.uberfire.jsbridge.tsexporter.util.Utils.createFileIfNotExists;

public class TsCodegenResultWriter {

    private final TsCodegenResult tsCodegenResult;
    private final String outputDir;

    public TsCodegenResultWriter(final TsCodegenResult tsCodegenResult) {
        this.tsCodegenResult = tsCodegenResult;
        this.outputDir = getProperty("ts-exporter-output-dir") + "/.tsexporter";
    }

    public void write() {
        writeRootConfigFiles();
        writeGeneratedPackages();
        writeDecoratorPackages();
    }

    private void writeDecoratorPackages() {
        //TODO:
    }

    private void writeRootConfigFiles() {
        final TsExporterResource rootPackageJson = tsCodegenResult.getRootPackageJson();
        write(rootPackageJson, buildPath(rootPackageJson.getUnscopedNpmPackageName(), "package.json"));

        final TsExporterResource lernaJson = tsCodegenResult.getLernaJson();
        write(lernaJson, buildPath(lernaJson.getUnscopedNpmPackageName(), "lerna.json"));
    }

    private void writeGeneratedPackages() {
        tsCodegenResult.getTsNpmPackages().forEach(this::writeNpmPackage);
    }

    private void writeNpmPackage(final TsNpmPackage tsNpmPackage) {

        tsNpmPackage.getClasses().forEach(tsClass -> write(tsClass,
                                                           buildPath("packages/" + tsClass.getUnscopedNpmPackageName(),
                                                                     "src/" + tsClass.getRelativePath() + ".ts")));

        final TsExporterResource indexTs = tsNpmPackage.getIndexTs();
        write(indexTs, buildPath("packages/" + indexTs.getUnscopedNpmPackageName(), "src/index.ts"));

        final TsExporterResource webpackConfigJs = tsNpmPackage.getWebpackConfigJs();
        write(webpackConfigJs, buildPath("packages/" + webpackConfigJs.getUnscopedNpmPackageName(), "webpack.config.js"));

        final TsExporterResource tsConfigJson = tsNpmPackage.getTsConfigJson();
        write(tsConfigJson, buildPath("packages/" + tsConfigJson.getUnscopedNpmPackageName(), "tsconfig.json"));

        final TsExporterResource packageJson = tsNpmPackage.getPackageJson();
        write(packageJson, buildPath("packages/" + packageJson.getUnscopedNpmPackageName(), "package.json"));
    }

    private void write(final TsExporterResource resource,
                       final Path path) {

        try {
            System.out.println("Saving file: " + path + "...");
            Files.createDirectories(path.getParent());
            Files.write(createFileIfNotExists(path), resource.toSource().getBytes());
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Path buildPath(final String unscopedNpmPackageName,
                           final String relativeFilePath) {

        return Paths.get(format(outputDir + "/%s/%s", unscopedNpmPackageName, relativeFilePath).replace("/", separator));
    }

    public String getOutputDir() {
        return outputDir;
    }
}
