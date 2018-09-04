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

package org.uberfire.jsbridge.tsexporter.meta.hierarchy;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

public class DependencyGraph {

    private final Map<TypeElement, Vertex> graph;

    public DependencyGraph() {
        graph = new HashMap<>();
    }

    public Vertex add(final Element element) {
        if (element == null || !element.getKind().isClass() && !element.getKind().isInterface()) {
            return null;
        }

        final TypeElement typeElement = (TypeElement) element;
        final Vertex existingVertex = graph.get(typeElement);
        if (existingVertex != null) {
            return existingVertex;
        }

        System.out.println("Adding " + typeElement.asType());
        graph.put(typeElement, new Vertex((DeclaredType) typeElement.asType()));
        return graph.computeIfPresent(typeElement, (t, vertex) -> vertex.init());
    }

    public class Vertex {

        private final List<Vertex> adjacencies;
        private final PojoTsClass pojoClass;

        private Vertex(final DeclaredType declaredType) {
            this(new PojoTsClass(declaredType), emptyList());
        }

        private <T> Vertex(final PojoTsClass pojoTsClass,
                           final List<Vertex> adjacencies) {

            this.pojoClass = pojoTsClass;
            this.adjacencies = adjacencies;
        }

        private Vertex init() {
            return new Vertex(pojoClass, pojoClass.getDependencies().stream()
                    .map(s -> ((TypeElement) s.asElement()))
                    .map(DependencyGraph.this::add)
                    .collect(toList()));
        }

        public PojoTsClass getPojoClass() {
            return pojoClass;
        }

        public List<Vertex> getAdjacencies() {
            return adjacencies;
        }

        @Override
        public String toString() {
            return pojoClass.getType().toString();
        }
    }

    public Set<Vertex> vertices() {
        return new HashSet<>(graph.values());
    }
}
