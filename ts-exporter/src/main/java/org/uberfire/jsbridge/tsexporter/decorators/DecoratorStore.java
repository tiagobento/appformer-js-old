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

import javax.lang.model.type.TypeMirror;

import org.uberfire.jsbridge.tsexporter.Main;

import static java.lang.String.format;
import static java.util.Collections.emptySet;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;

public class DecoratorStore {

    public static final DecoratorStore EMPTY = new DecoratorStore(emptySet());

    private Map<String, DecoratorDependency> decorators;

    public DecoratorStore(final Set<DecoratorDependency> decorators) {
        this.decorators = decorators.stream()
                .collect(toMap(DecoratorDependency::getDecoratedFqcn, identity(), (kept, discarded) -> {
                    System.out.println(format("Found more than one decorator for %s. Keeping %s and discarding %s.", kept.getDecoratedFqcn(), kept.getDecoratorPath(), discarded.getDecoratorPath()));
                    return kept;
                }));
    }

    public boolean hasDecoratorFor(final TypeMirror type) {
        return decorators.containsKey(Main.types.erasure(type).toString());
    }

    public DecoratorDependency getDecoratorFor(final TypeMirror type) {
        return decorators.get(Main.types.erasure(type).toString());
    }
}
