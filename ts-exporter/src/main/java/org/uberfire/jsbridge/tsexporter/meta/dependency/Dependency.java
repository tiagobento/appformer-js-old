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

import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;

import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;

public interface Dependency {

    String uniqueName(final DeclaredType owner);

    String relativePath();

    String getModuleName();

    default String sourcePath() {
        return (this instanceof Java ? "output/" : "") + getModuleName() + "/" + relativePath();
    }

    boolean represents(final DeclaredType type);

    class Java implements Dependency {

        private final DeclaredType declaredType;
        private final DecoratorStore decoratorStore;

        public Java(final DeclaredType declaredType, final DecoratorStore decoratorStore) {
            this.declaredType = declaredType;
            this.decoratorStore = decoratorStore;
        }

        public DeclaredType getDeclaredType() {
            return declaredType;
        }

        @Override
        public String uniqueName(final DeclaredType owner) {
            return new JavaType(declaredType, owner).translate(TYPE_ARGUMENT_IMPORT, decoratorStore).toTypeScript();
        }

        @Override
        public String relativePath() {
            return new PojoTsClass(declaredType, decoratorStore).getRelativePath();
        }

        @Override
        public String getModuleName() {
            return new PojoTsClass(declaredType, decoratorStore).getModuleName();
        }

        @Override
        public boolean represents(final DeclaredType type) {
            return declaredType.asElement().equals(type.asElement());
        }

        @Override
        public String toString() {
            return declaredType.toString();
        }
    }

    class BuiltIn implements Dependency {

        public static final BuiltIn JAVA_INTEGER = new BuiltIn("JavaInteger", "appformer", "java-wrappers/JavaInteger");
        public static final BuiltIn JAVA_BYTE = new BuiltIn("JavaByte", "appformer", "java-wrappers/JavaByte");
        public static final BuiltIn JAVA_DOUBLE = new BuiltIn("JavaDouble", "appformer", "java-wrappers/JavaDouble");
        public static final BuiltIn JAVA_FLOAT = new BuiltIn("JavaFloat", "appformer", "java-wrappers/JavaFloat");
        public static final BuiltIn JAVA_LONG = new BuiltIn("JavaLong", "appformer", "java-wrappers/JavaLong");
        public static final BuiltIn JAVA_NUMBER = new BuiltIn("JavaNumber", "appformer", "java-wrappers/JavaNumber");
        public static final BuiltIn JAVA_SHORT = new BuiltIn("JavaShort", "appformer", "java-wrappers/JavaShort");
        public static final BuiltIn JAVA_BIG_INTEGER = new BuiltIn("JavaBigInteger", "appformer", "java-wrappers/JavaBigInteger");
        public static final BuiltIn JAVA_BIG_DECIMAL = new BuiltIn("JavaBigDecimal", "appformer", "java-wrappers/JavaBigDecimal");
        public static final BuiltIn JAVA_TREE_SET = new BuiltIn("JavaTreeSet", "appformer", "java-wrappers/JavaTreeSet");
        public static final BuiltIn JAVA_LINKED_LIST = new BuiltIn("JavaLinkedList", "appformer", "java-wrappers/JavaLinkedList");
        public static final BuiltIn JAVA_TREE_MAP = new BuiltIn("JavaTreeMap", "appformer", "java-wrappers/JavaTreeMap");
        public static final BuiltIn JAVA_OPTIONAL = new BuiltIn("JavaOptional", "appformer", "java-wrappers/JavaOptional");

        private String uniqueName;
        private String relativePath;
        private String moduleName;

        private BuiltIn(final String uniqueName,
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
        public boolean represents(final DeclaredType type) {
            return false;
        }
    }
}
