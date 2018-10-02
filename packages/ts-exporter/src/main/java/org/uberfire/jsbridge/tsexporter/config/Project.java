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

import java.net.URL;
import java.util.Map;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import static java.util.stream.Collectors.toMap;
import static org.uberfire.jsbridge.tsexporter.model.TsClass.getMavenModuleNameFromSourceFilePath;
import static org.uberfire.jsbridge.tsexporter.util.Utils.readClasspathResource;

public class Project {

    private final String name;
    private final Type type;
    private final String mvnModuleName;
    private final Map<String, String> decorators;

    public Project(final URL url) {
        final String jsonString = readClasspathResource(url);
        final JsonObject json = new JsonParser().parse(jsonString).getAsJsonObject();

        name = json.get("name").getAsString();

        type = Type.valueOf(json.get("type").getAsString().trim().toUpperCase());

        mvnModuleName = getMavenModuleNameFromSourceFilePath(url.getFile());

        decorators = json.get("decorators").getAsJsonObject().entrySet()
                .stream().collect(toMap(Map.Entry::getKey,
                                        e -> e.getValue().getAsString()));
    }

    public String getMvnModuleName() {
        return mvnModuleName;
    }

    public String getName() {
        return name;
    }

    public Map<String, String> getDecorators() {
        return decorators;
    }

    public Type getType() {
        return type;
    }

    public enum Type {
        DECORATORS,
        LIB
    }
}
