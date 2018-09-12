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

package org.uberfire.jsbridge.tsexporter.dependency;

import javax.lang.model.element.Element;
import javax.lang.model.type.DeclaredType;

public class BuiltInImportEntry implements ImportEntry {

    public static final BuiltInImportEntry JAVA_INTEGER = new BuiltInImportEntry("JavaInteger", "appformer", "java-wrappers/JavaInteger");
    public static final BuiltInImportEntry JAVA_BYTE = new BuiltInImportEntry("JavaByte", "appformer", "java-wrappers/JavaByte");
    public static final BuiltInImportEntry JAVA_DOUBLE = new BuiltInImportEntry("JavaDouble", "appformer", "java-wrappers/JavaDouble");
    public static final BuiltInImportEntry JAVA_FLOAT = new BuiltInImportEntry("JavaFloat", "appformer", "java-wrappers/JavaFloat");
    public static final BuiltInImportEntry JAVA_LONG = new BuiltInImportEntry("JavaLong", "appformer", "java-wrappers/JavaLong");
    public static final BuiltInImportEntry JAVA_NUMBER = new BuiltInImportEntry("JavaNumber", "appformer", "java-wrappers/JavaNumber");
    public static final BuiltInImportEntry JAVA_SHORT = new BuiltInImportEntry("JavaShort", "appformer", "java-wrappers/JavaShort");
    public static final BuiltInImportEntry JAVA_BIG_INTEGER = new BuiltInImportEntry("JavaBigInteger", "appformer", "java-wrappers/JavaBigInteger");
    public static final BuiltInImportEntry JAVA_BIG_DECIMAL = new BuiltInImportEntry("JavaBigDecimal", "appformer", "java-wrappers/JavaBigDecimal");
    public static final BuiltInImportEntry JAVA_TREE_SET = new BuiltInImportEntry("JavaTreeSet", "appformer", "java-wrappers/JavaTreeSet");
    public static final BuiltInImportEntry JAVA_LINKED_LIST = new BuiltInImportEntry("JavaLinkedList", "appformer", "java-wrappers/JavaLinkedList");
    public static final BuiltInImportEntry JAVA_TREE_MAP = new BuiltInImportEntry("JavaTreeMap", "appformer", "java-wrappers/JavaTreeMap");
    public static final BuiltInImportEntry JAVA_OPTIONAL = new BuiltInImportEntry("JavaOptional", "appformer", "java-wrappers/JavaOptional");

    private final String uniqueName;
    private final String relativePath;
    private final String moduleName;

    private BuiltInImportEntry(final String uniqueName,
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
