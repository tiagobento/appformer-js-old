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

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorsNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.GeneratedNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.NpmPackage;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.config.LernaJson;
import org.uberfire.jsbridge.tsexporter.model.config.NpmIgnore;
import org.uberfire.jsbridge.tsexporter.model.config.PackageJsonForAggregationNpmPackage;

import static java.io.File.separator;
import static java.lang.String.format;
import static java.lang.System.getProperty;
import static org.uberfire.jsbridge.tsexporter.model.NpmPackage.Type.FINAL;
import static org.uberfire.jsbridge.tsexporter.util.Utils.createFileIfNotExists;

public class TsCodegenResultWriter {

    private final TsCodegenResult tsCodegenResult;
    private final String outputDir;

    public TsCodegenResultWriter(final TsCodegenResult tsCodegenResult) {
        this.tsCodegenResult = tsCodegenResult;
        this.outputDir = getProperty("ts-exporter-output-dir") + "/.tsexporter";
    }

    public void write() {
        write(tsCodegenResult.getRootPackageJson(), buildPath("", "package.json"));
        write(tsCodegenResult.getLernaJson(), buildPath("", "lerna.json"));
        tsCodegenResult.getNpmPackages().forEach(this::writeNpmPackage);
        tsCodegenResult.getDecoratorsNpmPackagesByDecoratedNpmPackages().forEach(this::writeDecoratorNpmPackage);
    }

    private void writeDecoratorNpmPackage(final GeneratedNpmPackage decoratedNpmPackage,
                                          final DecoratorsNpmPackage decoratorsNpmPackage) {

        final String baseDir = getNpmPackageBaseDir(decoratorsNpmPackage, decoratedNpmPackage);
        decoratorsNpmPackage.getResources().forEach(r -> this.write(r, buildPath(baseDir, r.getResourcePath())));
    }

    private void writeNpmPackage(final GeneratedNpmPackage npmPackage) {

        final String baseDir = getNpmPackageBaseDir(npmPackage, npmPackage);

        npmPackage.getClasses().forEach(
                tsClass -> write(tsClass, buildPath(baseDir, "src/" + tsClass.getRelativePath() + ".ts")));

        write(npmPackage.getIndexTs(), buildPath(baseDir, "src/index.ts"));
        write(npmPackage.getWebpackConfigJs(), buildPath(baseDir, "webpack.config.js"));
        write(npmPackage.getTsConfigJson(), buildPath(baseDir, "tsconfig.json"));
        write(npmPackage.getPackageJson(), buildPath(baseDir, "package.json"));

        if (npmPackage.getType().equals(FINAL)) {
            write2ndLayerPackageJson(npmPackage, baseDir);
        }
    }

    private void write2ndLayerPackageJson(final GeneratedNpmPackage npmPackage,
                                          final String finalNpmPackageBaseDir) {

        final String baseDir = finalNpmPackageBaseDir + "../../";

        try {
            Files.createSymbolicLink(buildPath(baseDir, "dist"), buildPath(finalNpmPackageBaseDir, "dist"));
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }

        final PackageJsonForAggregationNpmPackage packageJson = new PackageJsonForAggregationNpmPackage(
                npmPackage,
                tsCodegenResult.getDecoratorsNpmPackageName(npmPackage));

        write(packageJson, buildPath(baseDir, "package.json"));
        write(new LernaJson(npmPackage.getVersion()), buildPath(baseDir, "lerna.json"));
        write(new NpmIgnore(npmPackage), buildPath(baseDir, ".npmignore"));
    }

    private String getNpmPackageBaseDir(final NpmPackage npmPackage,
                                        final GeneratedNpmPackage decoratedNpmPackage) {

        final String unscopedNpmPackageName = npmPackage.getUnscopedNpmPackageName();

        switch (npmPackage.getType()) {
            case RAW:
                return format("packages/%s/packages/%s/", unscopedNpmPackageName, unscopedNpmPackageName + "-raw");
            case FINAL:
                return format("packages/%s/packages/%s/", unscopedNpmPackageName, unscopedNpmPackageName + "-final");
            case DECORATORS:
                return format("packages/%s/packages/%s/", decoratedNpmPackage.getUnscopedNpmPackageName(), unscopedNpmPackageName);
            case UNDECORATED:
                return format("packages/%s", unscopedNpmPackageName);
            default:
                throw new RuntimeException("Unknown type");
        }
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
