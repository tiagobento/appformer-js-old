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

import org.uberfire.jsbridge.tsexporter.config.AppFormerLib;
import org.uberfire.jsbridge.tsexporter.config.Configuration;
import org.uberfire.jsbridge.tsexporter.model.NpmPackage;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageForAppFormerLibs;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static javax.tools.StandardLocation.CLASS_OUTPUT;
import static org.uberfire.jsbridge.tsexporter.config.AppFormerLib.Type.LIB;

public class TsCodegenLibBundler {

    private final Configuration config;
    private final TsCodegenWriter writer;

    public TsCodegenLibBundler(final Configuration config,
                               final TsCodegenWriter writer) {

        this.config = config;
        this.writer = writer;
    }

    public void bundle() {

        final String registryEntries = config.getLibraries().stream()
                .filter(lib -> lib.getType().equals(LIB))
                .peek(this::writeEntryPoint)
                .flatMap(lib -> lib.getComponents().stream()
                        .map(componentId -> new SimpleImmutableEntry<>(componentId, getLibMainFileName(lib))))
                .map(e -> format("\"%s\": \"%s\"", e.getKey(), e.getValue()))
                .collect(joining(",\n"));

        writePublicResource("AppFormerComponentsRegistry.js",
                            format("window.AppFormerComponentsRegistry = { %s }", registryEntries));
    }

    private void writeEntryPoint(final AppFormerLib lib) {
        final String fileName = getLibMainFileName(lib);

        final NpmPackage npmPackage = new NpmPackageForAppFormerLibs(
                lib.getName(),
                writer.getVersion(),
                NpmPackage.Type.LIB);

        final String baseDir = writer.getNpmPackageBaseDir(npmPackage, null);
        final Path srcFilePath = writer.buildPath(baseDir, lib.getMain());

        try {
            final String contents = Files.lines(srcFilePath).collect(joining("\n"));
            writePublicResource(fileName, contents);
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void writePublicResource(final String fileName,
                                     final String contents) {

        try (final Writer filerWriter = Main.filer.createResource(CLASS_OUTPUT, "", "org/uberfire/jsbridge/public/" + fileName).openWriter()) {
            filerWriter.write(contents);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String getLibMainFileName(final AppFormerLib lib) {
        return lib.getName() + ".js";
    }
}
