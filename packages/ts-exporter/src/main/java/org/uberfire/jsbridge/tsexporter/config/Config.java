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

package org.uberfire.jsbridge.tsexporter.config;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static java.util.Collections.list;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.uberfire.jsbridge.tsexporter.util.Utils.getResources;

public class Config {

    private final Map<String, Project> projectsByName;

    public Config() {
        projectsByName = list(getResources("META-INF/appformerjs.json")).stream()
                .map(Project::new)
                .collect(toMap(Project::getName, identity()));
    }

    public Set<Project> getProjects() {
        return new HashSet<>(projectsByName.values());
    }
}
