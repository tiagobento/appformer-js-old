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

package org.uberfire.jsbridge.tsexporter.decorators;

import java.util.Map;
import java.util.Scanner;
import java.util.Set;

import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.model.TsClass;
import org.uberfire.jsbridge.tsexporter.model.TsNpmPackage;

import static java.lang.String.format;
import static java.util.Collections.emptySet;
import static java.util.Collections.list;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.model.TsClass.getMavenModuleNameFromSourceFilePath;
import static org.uberfire.jsbridge.tsexporter.util.Utils.getResources;

public class DecoratorStore {

    public static final DecoratorStore NO_DECORATORS = new DecoratorStore(emptySet());

    private final Map<String, ImportEntryDecorator> decorators;

    public DecoratorStore() {
        this.decorators = asMap(readDecoratorFiles());
    }

    public DecoratorStore(final Set<ImportEntryDecorator> decorators) {
        this.decorators = asMap(decorators);
    }

    private DecoratorStore(final Map<String, ImportEntryDecorator> decorators) {
        this.decorators = decorators;
    }

    private Map<String, ImportEntryDecorator> asMap(final Set<ImportEntryDecorator> decorators) {
        return decorators.stream()
                .collect(toMap(ImportEntryDecorator::getDecoratedFqcn, identity(), (kept, discarded) -> {
                    System.out.println(format("Found more than one decorator for %s. Keeping %s and discarding %s.", kept.getDecoratedFqcn(), kept.getDecoratorPath(), discarded.getDecoratorPath()));
                    return kept;
                }));
    }

    private Set<ImportEntryDecorator> readDecoratorFiles() {
        return list(getResources("META-INF/appformerjs.json")).stream().flatMap(url -> {
            try (final Scanner scanner = new Scanner(url.openStream()).useDelimiter("\\A")) {
                JsonObject config = new JsonParser().parse(scanner.hasNext() ? scanner.next() : "").getAsJsonObject();
                return config.get("decorators").getAsJsonObject()
                        .entrySet().stream().map(entry -> new ImportEntryDecorator(
                                getMavenModuleNameFromSourceFilePath(url.getFile()),
                                config.get("name").getAsString(),
                                entry.getKey(),
                                entry.getValue().getAsString()));
            } catch (final Exception e) {
                throw new RuntimeException(e);
            }
        }).collect(toSet());
    }

    public boolean shouldDecorate(final TypeMirror type, TypeMirror owner) {
        return decorators.containsKey(types.erasure(type).toString());
    }

    public ImportEntryDecorator getDecoratorFor(final TypeMirror type) {
        return decorators.get(types.erasure(type).toString());
    }

    private Set<String> getUnscopedNpmPackageNamesWhichHaveDecorators() {
        return decorators.values().stream()
                .map(ImportEntryDecorator::getDecoratedMvnModule)
                .collect(toSet());
    }

    public Set<String> getDecoratorsNpmPackages() {
        return decorators.values().stream()
                .map(ImportEntryDecorator::getNpmPackageName)
                .collect(toSet());
    }

    public boolean hasDecoratorFor(final TsNpmPackage tsNpmPackage) {
        return hasDecoratorFor(tsNpmPackage.getUnscopedNpmPackageName());
    }

    public boolean hasDecoratorFor(final TsClass tsClass) {
        return hasDecoratorFor(tsClass.getUnscopedNpmPackageName());
    }

    public boolean hasDecoratorFor(final String unscopedNpmPackageName) {
        return getUnscopedNpmPackageNamesWhichHaveDecorators().contains(unscopedNpmPackageName);
    }

    public DecoratorStore ignoringForCurrentNpmPackage() {
        return new DecoratorStore(decorators) {
            @Override
            public DecoratorStore ignoringForCurrentNpmPackage() {
                return this;
            }

            @Override
            public boolean shouldDecorate(final TypeMirror type, final TypeMirror owner) {
                final String npmPackageName = new PojoTsClass((DeclaredType) owner, this).getUnscopedNpmPackageName();
                return super.shouldDecorate(type, owner) && !this.getDecoratorFor(type).getDecoratedMvnModule().equals(npmPackageName);
            }
        };
    }
}
