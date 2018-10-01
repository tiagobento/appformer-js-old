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
import java.util.Set;

import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.uberfire.jsbridge.tsexporter.model.NpmPackageGenerated;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.util.Lazy;

import static java.lang.String.format;
import static java.util.Collections.emptySet;
import static java.util.Collections.list;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.Main.types;
import static org.uberfire.jsbridge.tsexporter.model.TsClass.getMavenModuleNameFromSourceFilePath;
import static org.uberfire.jsbridge.tsexporter.util.Utils.getResources;
import static org.uberfire.jsbridge.tsexporter.util.Utils.readClasspathResource;

public class DecoratorStore {

    public static final DecoratorStore NO_DECORATORS = new DecoratorStore(emptySet());

    private final Lazy<Map<String, ImportEntryForDecorator>> decorators;

    public DecoratorStore() {
        this.decorators = new Lazy<>(() -> asMap(readDecoratorFiles()));
    }

    public DecoratorStore(final Set<ImportEntryForDecorator> decorators) {
        this.decorators = new Lazy<>(() -> asMap(decorators));
    }

    private DecoratorStore(final Map<String, ImportEntryForDecorator> decorators) {
        this.decorators = new Lazy<>(() -> decorators);
    }

    private Map<String, ImportEntryForDecorator> asMap(final Set<ImportEntryForDecorator> decorators) {
        return decorators.stream()
                .collect(toMap(ImportEntryForDecorator::getDecoratedFqcn, identity(), (kept, discarded) -> {
                    System.out.println(format("Found more than one decorator for %s. Keeping %s and discarding %s.", kept.getDecoratedFqcn(), kept.getDecoratorPath(), discarded.getDecoratorPath()));
                    return kept;
                }));
    }

    private Set<ImportEntryForDecorator> readDecoratorFiles() {
        return list(getResources("META-INF/appformerjs.json")).stream().flatMap(url -> {
            final JsonObject config = new JsonParser().parse(readClasspathResource(url)).getAsJsonObject();
            final String mvnModuleName = getMavenModuleNameFromSourceFilePath(url.getFile());
            final String decoratorsNpmPackageName = config.get("name").getAsString();
            return config.get("decorators").getAsJsonObject().entrySet().stream()
                    .map(e -> new ImportEntryForDecorator(mvnModuleName,
                                                          decoratorsNpmPackageName,
                                                          e.getKey(),
                                                          e.getValue().getAsString()));
        }).collect(toSet());
    }

    public boolean shouldDecorate(final TypeMirror type, TypeMirror owner) {
        return decorators.get().containsKey(types.erasure(type).toString());
    }

    public ImportEntryForDecorator getDecoratorFor(final TypeMirror type) {
        return decorators.get().get(types.erasure(type).toString());
    }

    public boolean hasDecoratorsFor(final String unscopedNpmPackageName) {
        return decorators.get().values().stream()
                .map(ImportEntryForDecorator::getDecoratedMvnModule)
                .collect(toSet())
                .contains(unscopedNpmPackageName);
    }

    public DecoratorStore ignoringForCurrentNpmPackage() {
        return new DecoratorStore(decorators.get()) {
            @Override
            public DecoratorStore ignoringForCurrentNpmPackage() {
                return this;
            }

            @Override
            public boolean shouldDecorate(final TypeMirror type, final TypeMirror owner) {
                final String unscopedNpmPackageName = new PojoTsClass((DeclaredType) owner, this).getUnscopedNpmPackageName();
                return super.shouldDecorate(type, owner) && !this.getDecoratorFor(type).getDecoratedMvnModule().equals(unscopedNpmPackageName);
            }
        };
    }

    public String getDecoratorsNpmPackageNameFor(final NpmPackageGenerated npmPackage) {
        return getDecoratorNpmPackageNamesByDecoratedMvnModuleNames().get(npmPackage.getUnscopedNpmPackageName());
    }

    public Map<String, String> getDecoratorNpmPackageNamesByDecoratedMvnModuleNames() {
        return decorators.get().values().stream()
                .collect(toMap(ImportEntryForDecorator::getDecoratedMvnModule, ImportEntryForDecorator::getNpmPackageName, (a, b) -> a));
    }
}
