package org.uberfire.jsbridge.tsexporter.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import static org.uberfire.jsbridge.tsexporter.config.PerspectiveComponentParams.Fields.IS_DEFAULT;

public class PerspectiveComponentParams {

    public static Map<String, String> fromJson(final JsonObject json) {

        final Map<String, String> params = new HashMap<>();

        if (json == null) {
            return params;
        }

        getBoolean(IS_DEFAULT, json).ifPresent(data -> params.put(IS_DEFAULT.fieldName, data.toString()));

        return params;
    }

    private static Optional<Boolean> getBoolean(final Fields field, final JsonObject json) {
        return get(field, json, JsonElement::getAsBoolean);
    }

    private static <T> Optional<T> get(final Fields field,
                                       final JsonObject json,
                                       final Function<JsonElement, T> extractor) {

        final JsonElement element = json.get(field.fieldName);
        if (element.isJsonNull()) {
            return Optional.empty();
        }

        return Optional.of(extractor.apply(element));
    }

    enum Fields {
        IS_DEFAULT("is_default");

        private final String fieldName;

        Fields(final String fieldName) {
            this.fieldName = fieldName;
        }
    }
}
