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

package org.uberfire.jsbridge.tsexporter.meta.translatable;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.lang.model.type.TypeVariable;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.dependency.ImportEntry;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;

import static java.util.Collections.singleton;
import static javax.lang.model.type.TypeKind.NULL;
import static javax.lang.model.type.TypeKind.TYPEVAR;
import static org.uberfire.jsbridge.tsexporter.meta.translatable.Translatable.SourceUsage.TYPE_ARGUMENT_USE;

public class TranslatableTypeVar implements Translatable {

    private String translatedUse;
    private String translatedDeclaration;
    private List<ImportEntry> aggregated = new ArrayList<>();

    public TranslatableTypeVar(final JavaType javaType,
                               final DecoratorStore decoratorStore) {

        this.translatedUse = javaType.getType().toString();

        if (!javaType.getType().getKind().equals(TYPEVAR)) {
            this.translatedDeclaration = this.translatedUse;
            return;
        }

        final TypeVariable typeVariable = (TypeVariable) javaType.getType();
        if (!hasRelevantUpperBound(typeVariable)) {
            this.translatedDeclaration = this.translatedUse;
            return;
        }

        final Translatable upperBound = new JavaType(typeVariable.getUpperBound(), javaType.getOwner())
                .translate(decoratorStore, new HashSet<>(singleton(typeVariable.asElement())));

        this.aggregated.addAll(upperBound.getAggregatedImportEntries());
        this.translatedDeclaration = typeVariable.toString() + " extends " + upperBound.toTypeScript(TYPE_ARGUMENT_USE);
    }

    private boolean hasRelevantUpperBound(final TypeVariable typeVariable) {
        return !typeVariable.getUpperBound().getKind().equals(NULL)
                && !typeVariable.getUpperBound().toString().equals("java.lang.Object");
    }

    @Override
    public String toTypeScript(final SourceUsage sourceUsage) {
        switch (sourceUsage) {
            case TYPE_ARGUMENT_USE:
            case FIELD_DECLARATION:
                return translatedUse;
            case TYPE_ARGUMENT_DECLARATION:
                return translatedDeclaration;
            case IMPORT_STATEMENT:
            default:
                throw new RuntimeException();
        }
    }

    @Override
    public List<ImportEntry> getAggregatedImportEntries() {
        return aggregated;
    }
}
