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
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;

import javax.lang.model.element.TypeElement;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorImportEntry;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.model.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.model.config.IndexTs;
import org.uberfire.jsbridge.tsexporter.model.config.LernaJson;
import org.uberfire.jsbridge.tsexporter.model.config.PackageJson;
import org.uberfire.jsbridge.tsexporter.model.config.RootPackageJson;
import org.uberfire.jsbridge.tsexporter.model.config.TsConfigJson;
import org.uberfire.jsbridge.tsexporter.model.config.WebpackConfigJs;
import org.uberfire.jsbridge.tsexporter.util.Utils;

import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;
import static java.util.stream.Stream.empty;
import static org.uberfire.jsbridge.tsexporter.Main.TS_EXPORTER_PACKAGE;
import static org.uberfire.jsbridge.tsexporter.Main.elements;
import static org.uberfire.jsbridge.tsexporter.util.Utils.createFileIfNotExists;
import static org.uberfire.jsbridge.tsexporter.util.Utils.distinctBy;
import static org.uberfire.jsbridge.tsexporter.util.Utils.getResources;
import static org.uberfire.jsbridge.tsexporter.util.Utils.linesJoinedBy;

public class TsCodegenExporter {

    private final DependencyGraph dependencyGraph;
    private final DecoratorStore decoratorStore;

    public TsCodegenExporter(final Set<DecoratorImportEntry> decorators) {
        this.decoratorStore = new DecoratorStore(decorators);
        this.dependencyGraph = new DependencyGraph(decoratorStore);
    }

    public void run() {

        concat(getTsFilesFrom("portables.tsexporter").stream(),
               getClassesFromErraiAppPropertiesFiles().stream()
        ).forEach(dependencyGraph::add);

        final Set<TsClass> rpcTsClasses = getTsFilesFrom("remotes.tsexporter").stream()
                .map(element -> new RpcCallerTsClass(element, dependencyGraph, decoratorStore))
                .peek(TsClass::toSource)
                .collect(toSet());

        concat(rpcTsClasses.stream().parallel(),
               dependencyGraph.vertices().stream().parallel().map(DependencyGraph.Vertex::getPojoClass))
                .parallel()
                .filter(distinctBy(tsClass -> tsClass.getType().toString()))
                .peek(tsClass -> write(tsClass, buildPath("packages/" + tsClass.getUnscopedNpmPackageName(), "src/" + tsClass.getRelativePath() + ".ts")))
                .collect(groupingBy(TsClass::getNpmPackageName))
                .entrySet().stream()
                .parallel()
                .peek(e -> {
                    final TsExporterResource tsExporterResource = new IndexTs(e.getKey(), e.getValue());
                    write(tsExporterResource, buildPath("packages/" + tsExporterResource.getUnscopedNpmPackageName(), "src/index.ts"));
                })
                .peek(e -> {
                    final TsExporterResource tsExporterResource = new WebpackConfigJs(e.getKey(), e.getValue());
                    write(tsExporterResource, buildPath("packages/" + tsExporterResource.getUnscopedNpmPackageName(), "webpack.config.js"));
                })
                .peek(e -> {
                    final TsExporterResource tsExporterResource = new TsConfigJson(e.getKey(), e.getValue());
                    write(tsExporterResource, buildPath("packages/" + tsExporterResource.getUnscopedNpmPackageName(), "tsconfig.json"));
                })
                .peek(e -> {
                    final PackageJson packageJson = new PackageJson(e.getKey(), e.getValue());
                    write(packageJson, buildPath("packages/" + packageJson.getUnscopedNpmPackageName(), "package.json"));
                })
                .forEach(i -> {
                });

        final TsExporterResource rootPackageJson = new RootPackageJson();
        write(rootPackageJson, buildPath(rootPackageJson.getUnscopedNpmPackageName(), "package.json"));

        final TsExporterResource lernaJson = new LernaJson();
        write(lernaJson, buildPath(lernaJson.getUnscopedNpmPackageName(), "lerna.json"));

        if (bash("which verdaccio") != 0) {
            throw new RuntimeException("Verdaccio is not installed.");
        }

        if (bash("pgrep Verdaccio") != 0) {
            throw new RuntimeException("Verdaccio is not running.");
        }

        bash(linesJoinedBy(" && ", new String[]{
                "cd /tmp/ts-exporter",
                "npm i",
                "git init",
                "git add lerna.json",
                "git commit -m \"First commit\"",
                "npx lerna bootstrap",
                "npx lerna exec --concurrency `sysctl -n hw.ncpu` -- npm run unpublish",
                "npx lerna exec --concurrency `sysctl -n hw.ncpu` -- npm run build",
                "npx lerna exec --concurrency `sysctl -n hw.ncpu` -- npm run doPublish",
                "rm -rf .git",
        }));
    }

    private int bash(final String command) {
        try {
            final ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
            processBuilder.inheritIO();
            final Process process = processBuilder.start();
            process.waitFor();
            return process.exitValue();
        } catch (final Exception e) {
            throw new RuntimeException(format("Something failed while running command [ %s ]", command));
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

        return Paths.get(format("/tmp/ts-exporter/%s/%s", unscopedNpmPackageName, relativeFilePath).replace("/", File.separator));
    }

    private List<TypeElement> getClassesFromErraiAppPropertiesFiles() {
        return Collections.list(getResources("META-INF" + File.separator + "ErraiApp.properties")).stream()
                .map(Utils::loadPropertiesFile)
                .map(properties -> Optional.ofNullable(properties.getProperty("errai.marshalling.serializableTypes")))
                .filter(Optional::isPresent).map(Optional::get)
                .flatMap(serializableTypes -> stream(serializableTypes.split(" \n?")))
                .map(fqcn -> elements.getTypeElement(fqcn.trim().replace("$", ".")))
                .collect(toList());
    }

    private List<TypeElement> getTsFilesFrom(final String exportFileName) {
        return readAllExportFiles(exportFileName).stream()
                .map(elements::getTypeElement)
                .collect(toList());
    }

    private List<String> readAllExportFiles(final String fileName) {
        return Collections.list(getResources(TS_EXPORTER_PACKAGE.replace(".", File.separator) + File.separator + fileName)).stream()
                .flatMap(url -> {
                    try {
                        final Scanner scanner = new Scanner(url.openStream()).useDelimiter("\\A");
                        return scanner.hasNext() ? stream(scanner.next().split("\n")) : empty();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }).collect(toList());
    }
}
