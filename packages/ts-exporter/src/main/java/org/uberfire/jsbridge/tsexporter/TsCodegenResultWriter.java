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
import java.util.Arrays;

import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;
import org.uberfire.jsbridge.tsexporter.model.config.SubPackageJson;

import static java.io.File.separator;
import static java.lang.String.format;
import static java.lang.System.getProperty;
import static org.uberfire.jsbridge.tsexporter.model.TsNpmPackage.Type.FINAL;
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
        tsCodegenResult.getTsNpmPackages().forEach(this::writeNpmPackage);
        //TODO: Write decorator packages
    }

    private void writeNpmPackage(final TsNpmPackage tsNpmPackage) {

        final String baseDir = getBaseDir(tsNpmPackage.getType(),
                                          tsNpmPackage.getUnscopedNpmPackageName());

        tsNpmPackage.getClasses().forEach(
                tsClass -> write(tsClass, buildPath(baseDir, "src/" + tsClass.getRelativePath() + ".ts")));

        write(tsNpmPackage.getIndexTs(), buildPath(baseDir, "src/index.ts"));
        write(tsNpmPackage.getWebpackConfigJs(), buildPath(baseDir, "webpack.config.js"));
        write(tsNpmPackage.getTsConfigJson(), buildPath(baseDir, "tsconfig.json"));
        write(tsNpmPackage.getPackageJson(), buildPath(baseDir, "package.json"));

        if (Arrays.asList(FINAL).contains(tsNpmPackage.getType())) {
            try {
                Files.createSymbolicLink(buildPath(baseDir + "../../", "dist"), buildPath(baseDir, "dist"));
            } catch (final IOException e) {
                throw new RuntimeException(e);
            }
            final SubPackageJson packageJson = new SubPackageJson(tsNpmPackage.getNpmPackageName(),
                                                                  tsNpmPackage.getVersion(),
                                                                  tsCodegenResult.getDecoratorsNpmPackageName(tsNpmPackage),
                                                                  tsNpmPackage.getClasses());

            write(packageJson, buildPath(baseDir + "../../", "package.json"));
        }
    }

    private String getBaseDir(final TsNpmPackage.Type type,
                              final String unscopedNpmPackageName) {

        switch (type) {
            case RAW:
                return format("packages/%s/packages/%s/", unscopedNpmPackageName, unscopedNpmPackageName + "-raw");
            case FINAL:
                return format("packages/%s/packages/%s/", unscopedNpmPackageName, unscopedNpmPackageName + "-final");
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
