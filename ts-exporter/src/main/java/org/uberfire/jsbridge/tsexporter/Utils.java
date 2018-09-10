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
import java.util.Enumeration;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import com.sun.tools.javac.code.Symbol;

import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.joining;

public class Utils {

    public static Path createFileIfNotExists(final Path path) throws IOException {
        return path.toFile().exists() ? path : Files.createFile(path);
    }

    public static <T> Predicate<T> distinctBy(final Function<? super T, ?> keyExtractor) {
        final Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    public static String lines(final String... lines) {
        return stream(lines).collect(joining("\n"));
    }

    @SafeVarargs
    public static String formatRightToLeft(final String lines, final Supplier<String>... args) {
        return format(lines, reverse(stream(reverse(args)).map(Supplier::get).<Object>toArray(String[]::new)));
    }

    private static <T> T[] reverse(final T[] array) {
        for (int i = 0; i < array.length / 2; i++) {
            T temp = array[i];
            array[i] = array[array.length - i - 1];
            array[array.length - i - 1] = temp;
        }
        return array;
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

    public static <T> T get(final int a, final T[] array) {
        return array[a < 0 ? array.length + a : a];
    }

    static Enumeration<URL> getResources(final String resourceName) {
        try {
            return Utils.class.getClassLoader().getResources(resourceName);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }
}
