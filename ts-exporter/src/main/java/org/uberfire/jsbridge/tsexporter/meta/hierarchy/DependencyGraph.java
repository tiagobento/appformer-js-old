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

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;

import static java.util.Collections.emptySet;
import static java.util.Collections.singleton;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;

public class DependencyGraph {

    private final Map<TypeElement, Vertex> graph;

    public DependencyGraph() {
        graph = new HashMap<>();
    }

    public Vertex add(final Element element) {
        if (canBePartOfTheGraph(element)) {
            return null;
        }

        final TypeElement typeElement = (TypeElement) element;
        final Vertex existingVertex = graph.get(typeElement);
        if (existingVertex != null) {
            return existingVertex;
        }

        System.out.println("Adding " + typeElement.asType());
        graph.put(typeElement, new Vertex(typeElement));
        return graph.computeIfPresent(typeElement, (t, vertex) -> vertex.init());
    }

    private boolean canBePartOfTheGraph(final Element element) {
        return element == null || !element.getKind().isClass() && !element.getKind().isInterface();
    }

    public Set<Vertex> findAllDependencies(final Element element) {
        return findAllDependencies(singleton(element));
    }

    public Set<Vertex> findAllDependents(final Element element) {
        return findAllDependents(singleton(element));
    }

    public Set<Vertex> findAllDependencies(final Set<Element> elements) {
        return findAllConnections(elements, Vertex::getDependencies, new HashSet<>());
    }

    public Set<Vertex> findAllDependents(final Set<Element> elements) {
        return findAllConnections(elements, Vertex::getDependents, new HashSet<>());
    }

    private Set<Vertex> findAllConnections(final Set<Element> elements,
                                           final Function<Vertex, Set<Vertex>> connections,
                                           final Set<Vertex> visited) {

        if (elements.stream().allMatch(this::canBePartOfTheGraph)) {
            return emptySet();
        }

        final Set<Vertex> vertices = elements.stream()
                .map(key -> graph.get((TypeElement) key))
                .filter(Objects::nonNull)
                .collect(toSet());

        final Set<Vertex> nonVisited = new HashSet<>(vertices);
        nonVisited.removeAll(visited);
        visited.addAll(nonVisited);

        return concat(vertices.stream(), nonVisited.stream().flatMap(s -> connections.apply(s).stream())
                .map(Vertex::getElement)
                .map(e -> findAllConnections(singleton(e), connections, visited))
                .flatMap(Collection::stream))
                .collect(toSet());
    }

    public class Vertex {

        private final Set<Vertex> dependencies;
        private final Set<Vertex> dependents;
        private final PojoTsClass pojoClass;

        private Vertex(final TypeElement typeElement) {
            this(new PojoTsClass((DeclaredType) typeElement.asType()), emptySet(), new HashSet<>());
        }

        private Vertex(final PojoTsClass pojoTsClass,
                       final Set<Vertex> dependencies,
                       final Set<Vertex> dependents) {

            this.pojoClass = pojoTsClass;
            this.dependencies = dependencies;
            this.dependents = dependents;
        }

        private Vertex init() {
            final Vertex vertex = new Vertex(pojoClass, pojoClass.getDependencies().stream()
                    .map(s -> ((TypeElement) s.asElement()))
                    .map(DependencyGraph.this::add)
                    .collect(toSet()), new HashSet<>());

            vertex.dependencies.forEach(d -> d.dependents.add(vertex));

            return vertex;
        }

        public PojoTsClass getPojoClass() {
            return pojoClass;
        }

        public Set<Vertex> getDependencies() {
            return dependencies;
        }

        public TypeElement getElement() {
            return pojoClass.getElement();
        }

        @Override
        public String toString() {
            return pojoClass.getType().toString();
        }

        public Set<Vertex> getDependents() {
            return dependents;
        }
    }

    public Set<Vertex> vertices() {
        return new HashSet<>(graph.values());
    }
}
