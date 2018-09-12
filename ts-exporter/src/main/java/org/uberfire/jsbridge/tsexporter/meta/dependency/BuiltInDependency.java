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

package org.uberfire.jsbridge.tsexporter.meta.dependency;

import javax.lang.model.element.Element;
import javax.lang.model.type.DeclaredType;

public class BuiltInDependency implements Dependency {

    public static final BuiltInDependency JAVA_INTEGER = new BuiltInDependency("JavaInteger", "appformer", "java-wrappers/JavaInteger");
    public static final BuiltInDependency JAVA_BYTE = new BuiltInDependency("JavaByte", "appformer", "java-wrappers/JavaByte");
    public static final BuiltInDependency JAVA_DOUBLE = new BuiltInDependency("JavaDouble", "appformer", "java-wrappers/JavaDouble");
    public static final BuiltInDependency JAVA_FLOAT = new BuiltInDependency("JavaFloat", "appformer", "java-wrappers/JavaFloat");
    public static final BuiltInDependency JAVA_LONG = new BuiltInDependency("JavaLong", "appformer", "java-wrappers/JavaLong");
    public static final BuiltInDependency JAVA_NUMBER = new BuiltInDependency("JavaNumber", "appformer", "java-wrappers/JavaNumber");
    public static final BuiltInDependency JAVA_SHORT = new BuiltInDependency("JavaShort", "appformer", "java-wrappers/JavaShort");
    public static final BuiltInDependency JAVA_BIG_INTEGER = new BuiltInDependency("JavaBigInteger", "appformer", "java-wrappers/JavaBigInteger");
    public static final BuiltInDependency JAVA_BIG_DECIMAL = new BuiltInDependency("JavaBigDecimal", "appformer", "java-wrappers/JavaBigDecimal");
    public static final BuiltInDependency JAVA_TREE_SET = new BuiltInDependency("JavaTreeSet", "appformer", "java-wrappers/JavaTreeSet");
    public static final BuiltInDependency JAVA_LINKED_LIST = new BuiltInDependency("JavaLinkedList", "appformer", "java-wrappers/JavaLinkedList");
    public static final BuiltInDependency JAVA_TREE_MAP = new BuiltInDependency("JavaTreeMap", "appformer", "java-wrappers/JavaTreeMap");
    public static final BuiltInDependency JAVA_OPTIONAL = new BuiltInDependency("JavaOptional", "appformer", "java-wrappers/JavaOptional");

    private final String uniqueName;
    private final String relativePath;
    private final String moduleName;

    private BuiltInDependency(final String uniqueName,
                              final String moduleName,
                              final String relativePath) {

        this.uniqueName = uniqueName;
        this.moduleName = moduleName;
        this.relativePath = relativePath;
    }

    @Override
    public String uniqueName(final DeclaredType owner) {
        return getUniqueName();
    }

    public String getUniqueName() {
        return uniqueName;
    }

    @Override
    public String relativePath() {
        return relativePath;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public Element asElement() {
        return null;
    }

    @Override
    public boolean represents(final DeclaredType type) {
        return false;
    }
}
