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

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static org.uberfire.jsbridge.tsexporter.util.Utils.linesJoinedBy;

public class LernaBuilder {

    private final String baseDir;
    private final TsCodegenResult tsCodegenResult;

    public LernaBuilder(final String baseDir,
                        final TsCodegenResult tsCodegenResult) {

        this.baseDir = baseDir;
        this.tsCodegenResult = tsCodegenResult;
    }

    void build() {
        System.out.println("Verdaccio installed at:");
        if (bash("which verdaccio") != 0) {
            throw new RuntimeException("Verdaccio is not installed.");
        }

        System.out.println("Verdaccio is running with PID:");
        if (bash("pgrep Verdaccio") != 0) {
            throw new RuntimeException("Verdaccio is not running.");
        }

        System.out.println("Initializing packages...");
        bash(linesJoinedBy(" && ", new String[]{
                "cd " + baseDir,
                "npm i --registry http://localhost:4873",
                "npx lerna bootstrap --registry http://localhost:4873"
        }));

        System.out.println("Building npm packages that will be decorated...");
        buildPackages(tsCodegenResult.getTsNpmPackagesWhichHaveDecorators().stream()
                                 .flatMap(tsNpmPackage -> tsNpmPackage.getGeneratedDependenciesNpmPackageNames().stream())
                                 .map(n -> "--scope " + n)
                                 .collect(joining(" ")));

        System.out.println("Building Decorators...");
        //TODO: Build decorators

        System.out.println("Building all npm packages...");
        buildPackages("");
    }

    private void buildPackages(final String lernaArgs) {
        final String regularConcurrency = "--concurrency `nproc || sysctl -n hw.ncpu`";
        final String extremeConcurrency = "--concurrency `ls " + baseDir + "/packages | wc -l | awk '{$1=$1};1'`";

        bash(linesJoinedBy(" && ", new String[]{
                "cd " + baseDir,
                format("npx lerna exec %s %s -- npm run unpublish", lernaArgs, extremeConcurrency),
                format("npx lerna exec %s %s -- npm run build", lernaArgs, regularConcurrency),
                format("npx lerna exec %s %s -- npm run doPublish", lernaArgs, extremeConcurrency),
        }));
    }

    private int bash(final String command) {

        System.out.println("--> bash: " + command);
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
}
