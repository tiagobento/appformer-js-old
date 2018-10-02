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
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.AbstractMap.SimpleImmutableEntry;

import org.uberfire.jsbridge.tsexporter.config.Configuration;
import org.uberfire.jsbridge.tsexporter.config.Project;
import org.uberfire.jsbridge.tsexporter.model.NpmPackage;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageFor3rdPartyProjects;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static javax.tools.StandardLocation.CLASS_OUTPUT;
import static org.uberfire.jsbridge.tsexporter.Main.TS_EXPORTER_PACKAGE;
import static org.uberfire.jsbridge.tsexporter.config.Project.Type.LIB;

public class TsCodegenLibBundler {

    private static final String BUNDLER_DESTINATION_PACKAGE = TS_EXPORTER_PACKAGE;

    private final Configuration config;
    private final TsCodegenWriter writer;

    public TsCodegenLibBundler(final Configuration config,
                               final TsCodegenWriter writer) {

        this.config = config;
        this.writer = writer;
    }

    public void bundle() {

        final String registryEntries = config.getProjects().stream()
                .filter(project -> project.getType().equals(LIB))
                .peek(this::writeEntryPoint)
                .flatMap(project -> project.getComponents().stream()
                        .map(componentId -> new SimpleImmutableEntry<>(componentId, "test/" + getEntryPointFileName(project))))
                .map(e -> format("\"%s\": \"%s\"", e.getKey(), e.getValue()))
                .collect(joining(",\n"));

        writeResource(BUNDLER_DESTINATION_PACKAGE,
                      "AppFormerComponentsRegistry.js",
                      format("window.AppFormerComponentsRegistry = { %s }", registryEntries));
    }

    private void writeEntryPoint(final Project project) {
        final String fileName = getEntryPointFileName(project);

        final NpmPackage npmPackage = new NpmPackageFor3rdPartyProjects(
                project.getName(),
                writer.getVersion(),
                NpmPackage.Type.LIB);

        final String baseDir = writer.getNpmPackageBaseDir(npmPackage, null);
        final Path srcFilePath = writer.buildPath(baseDir, project.getMain());

        try {
            final String contents = Files.lines(srcFilePath).collect(joining("\n"));
            writeResource(BUNDLER_DESTINATION_PACKAGE, fileName, contents);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void writeResource(final String packageName,
                               final String fileName,
                               final String contents) {

        try (final Writer filerWriter = Main.filer.createResource(CLASS_OUTPUT, packageName, fileName).openWriter()) {
            filerWriter.write(contents);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String getEntryPointFileName(final Project project) {
        return project.getName().replace("-", "") + ".js";
    }
}
