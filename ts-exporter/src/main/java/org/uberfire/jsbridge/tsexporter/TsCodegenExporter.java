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

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorDependency;
import org.uberfire.jsbridge.tsexporter.meta.PackageJson;
import org.uberfire.jsbridge.tsexporter.meta.TsExporterResource;
import org.uberfire.jsbridge.tsexporter.meta.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.util.Utils;

import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;
import static java.util.stream.Stream.empty;
import static org.uberfire.jsbridge.tsexporter.Main.*;
import static org.uberfire.jsbridge.tsexporter.util.Utils.createFileIfNotExists;
import static org.uberfire.jsbridge.tsexporter.util.Utils.distinctBy;
import static org.uberfire.jsbridge.tsexporter.util.Utils.getResources;

public class TsCodegenExporter {

    private final DependencyGraph dependencyGraph;
    private final DecoratorStore decoratorStore;

    public TsCodegenExporter(final Set<DecoratorDependency> decorators) {
        this.decoratorStore = new DecoratorStore(decorators);
        this.dependencyGraph = new DependencyGraph(decoratorStore);
    }

    public void run() {


        concat(getTsFilesFrom("portables.txt").stream(),
               getClassesFromErraiAppPropertiesFiles().stream()
        ).forEach(dependencyGraph::add);

        final Set<TsClass> rpcTsClasses = getTsFilesFrom("remotes.txt").stream()
                .map(element -> new RpcCallerTsClass(element, dependencyGraph, decoratorStore))
                .peek(TsClass::toSource)
                .collect(toSet());

        concat(rpcTsClasses.stream().parallel(), dependencyGraph.vertices().stream().parallel().map(DependencyGraph.Vertex::getPojoClass))
                .parallel()
                .filter(distinctBy(tsClass -> tsClass.getType().toString()))
                .peek(this::write)
                .collect(groupingBy(TsClass::getModuleName))
                .entrySet().stream()
                .parallel()
                .map(e -> new PackageJson(e.getKey(), e.getValue()))
                .forEach(this::write);
    }

    private void write(final TsClass tsClass) {
        write(tsClass, buildPath(tsClass.getModuleName(), tsClass.getRelativePath() + ".ts"));
    }

    private void write(final PackageJson packageJson) {
        write(packageJson, buildPath(packageJson.getModuleName(), "package.json"));
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

    private Path buildPath(final String moduleName,
                           final String relativeFilePath) {

        return Paths.get(format("/tmp/ts-exporter/%s/%s", moduleName, relativeFilePath).replace("/", File.separator));
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
        return Collections.list(getResources(TS_EXPORTER_PACKAGE + File.separator + fileName)).stream()
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
