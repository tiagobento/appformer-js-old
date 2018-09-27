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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;

import static java.io.File.separator;
import static java.lang.String.format;
import static java.lang.System.getProperty;
import static java.util.Comparator.reverseOrder;
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
    }

    public void writeDecoratorPackages() {
        //TODO:
    }

    private void writeRootConfigFiles() {
        write(tsCodegenResult.getRootPackageJson(), buildPath("", "package.json"));
        write(tsCodegenResult.getLernaJson(), buildPath("", "lerna.json"));
    }

    private void writeGeneratedPackages() {
        tsCodegenResult.getTsNpmPackages().forEach(this::writeNpmPackage);
    }

    private void writeNpmPackage(final TsNpmPackage tsNpmPackage) {

        final String npmPackageBaseDir = "packages/" + tsNpmPackage.getUnscopedNpmPackageName();

        tsNpmPackage.getClasses().forEach(
                tsClass -> write(tsClass, buildPath(npmPackageBaseDir,
                                                    "src/" + tsClass.getRelativePath() + ".ts")));

        write(tsNpmPackage.getIndexTs(), buildPath(npmPackageBaseDir, "src/index.ts"));
        write(tsNpmPackage.getWebpackConfigJs(), buildPath(npmPackageBaseDir, "webpack.config.js"));
        write(tsNpmPackage.getTsConfigJson(), buildPath(npmPackageBaseDir, "tsconfig.json"));
        write(tsNpmPackage.getPackageJson(), buildPath(npmPackageBaseDir, "package.json"));
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

    public void removeOutputDir() {
        try {
            final boolean removed = Files.walk(Paths.get(outputDir))
                    .sorted(reverseOrder())
                    .map(Path::toFile)
                    .allMatch(File::delete);

            if (!removed) {
                throw new RuntimeException("Could not remove outputDir " + outputDir);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
