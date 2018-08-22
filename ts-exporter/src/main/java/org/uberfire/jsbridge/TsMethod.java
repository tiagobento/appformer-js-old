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

package org.uberfire.jsbridge;

import java.net.URL;

import javax.lang.model.element.TypeElement;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;

public class TsMethod {

    private final TypeElement _interface;
    private final JavaMethod method;

    public TsMethod(final TypeElement _interface,
                    final JavaMethod method) {

        this._interface = _interface;
        this.method = method;
    }

    public String toSource() {
        method.getParameters().values().stream().forEach(fqcn -> {
            try {
                final Class<?> clazz = Class.forName(fqcn);
                URL clazzLocation = clazz.getResource('/' + clazz.getName().replace('.', '/') + ".class");
                System.out.println(clazzLocation);
                //TODO: Parse clazzLocation to extract mvn module's name
            } catch (final ClassNotFoundException e) {
                //clazz is from source, should import Models from its own package.
            }
        });
        return format("export const %s = (args: { %s }) => rpc(%s, [%s]);",
                      name(), params(), erraiBusPath(), rpcCallParams());
    }

    private String name() {
        return method.getName();
    }

    private String params() {
        return method.getParameters().entrySet().stream()
                .map(e -> format("%s?: %s", e.getKey(), toTsType(e.getValue())))
                .collect(joining(", "));
    }

    private String toTsType(final String value) {
        switch (value) {
            case "java.lang.String":
                return "string";
            default:
                return value;
        }
    }

    private String rpcCallParams() {
        return method.getParameters().entrySet().stream()
                .map(param -> format("marshall(%s)", "args." + param.getKey()))
                .collect(joining(", "));
    }

    private String erraiBusPath() {
        return '"' + _interface.getQualifiedName().toString() + "|" + method.toErraiBusPath() + '"';
    }
}
