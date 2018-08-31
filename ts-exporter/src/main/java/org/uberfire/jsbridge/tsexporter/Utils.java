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

import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;

import javax.lang.model.element.TypeElement;

import static java.util.stream.Collectors.joining;

public class Utils {

    public static Path createFileIfNotExists(final Path path) throws IOException {
        return path.toFile().exists() ? path : Files.createFile(path);
    }

    public static <T> Predicate<T> distinctBy(final Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    public static String lines(final String... lines) {
        return Arrays.stream(lines).collect(joining("\n"));
    }

    public static Properties loadPropertiesFile(final URL fileUrl) {
        final Properties properties = new Properties();
        try {
            properties.load(fileUrl.openStream());
        } catch (final IOException e) {
            throw new RuntimeException("Failed to load properties file " + fileUrl, e);
        }
        return properties;
    }

    public static String getModuleName(final TypeElement typeElement) {
        try {
            final Field sourceFileField = typeElement.getClass().getField("sourcefile");
            sourceFileField.setAccessible(true);
            final String sourceFilePath = sourceFileField.get(typeElement).toString();

            if (sourceFilePath.contains("/src/main/java")) {
                return last(sourceFilePath.split("/src/main/java")[0].split("/"));
            }

            if (sourceFilePath.contains("/target/generated-sources")) {
                return last(sourceFilePath.split("/target/generated-sources")[0].split("/"));
            }

            if (sourceFilePath.contains("/src/test/java")) {
                return last(sourceFilePath.split("/src/test/java")[0].split("/")) + "-test";
            }

            if (sourceFilePath.contains("/target/generated-test-sources")) {
                return last(sourceFilePath.split("/target/generated-test-sources")[0].split("/")) + "-test";
            }

            throw new RuntimeException("Module name unretrievable from [" + sourceFilePath + "]");
        } catch (final Exception e) {
            throw new RuntimeException("Error while reading [sourcefile] field from @Remote interface element.", e);
        }
    }

    private static <T> T last(final T[] array) {
        return array[array.length - 1];
    }
}
