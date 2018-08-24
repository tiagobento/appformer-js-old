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

public class PortablePojoModule {

    private final String originatingFqcn;
    private final String name;

    public PortablePojoModule(final String originatingFqcn, final String name) {
        this.originatingFqcn = originatingFqcn;
        this.name = name;
    }

    public String getPath1() {
        return "output/" + name + "/" + originatingFqcn.replace(".", "/");
    }

    public String getPath2() {
        return name + "/" + originatingFqcn.replace(".", "/");
    }

    public String getOriginatingFqcn() {
        return originatingFqcn;
    }

    public String getVariableName() {
        return originatingFqcn.replace(".", "_");
    }
}
