package org.uberfire.jsbridge.tsexporter.config;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class ComponentConfiguration {

    private final String id;
    private final ComponentType type;
    private final Map<String, String> params;

    public ComponentConfiguration(final JsonElement json) {

        final JsonObject jsonObj = json.getAsJsonObject();

        this.id = jsonObj.get("id").getAsString();
        this.type = ComponentType.valueOf(jsonObj.get("type").getAsString().trim().toUpperCase());
        this.params = type.paramsBuilderFunc.apply(jsonObj.get("params").getAsJsonObject());
    }

    public String getId() {
        return this.id;
    }

    public ComponentType getType() {
        return this.type;
    }

    public Map<String, String> getParams() {
        return this.params;
    }

    public enum ComponentType {
        PERSPECTIVE(PerspectiveComponentParams::fromJson),
        SCREEN((json) -> new HashMap<>());

        private Function<JsonObject, Map<String, String>> paramsBuilderFunc;

        ComponentType(final Function<JsonObject, Map<String, String>> paramsBuilderFunc) {
            this.paramsBuilderFunc = paramsBuilderFunc;
        }
    }
}
