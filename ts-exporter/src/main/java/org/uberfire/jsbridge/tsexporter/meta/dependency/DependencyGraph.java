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
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;

public class DependencyGraph {

    private final Map<TypeElement, Vertex> graph;

    public DependencyGraph() {
        graph = new HashMap<>();
    }

    public Vertex add(final Dependency dependency) {
        if (dependency instanceof Dependency.Java) {
            return add(((Dependency.Java) dependency).getDeclaredType().asElement());
        } else {
            return null;
        }
    }

    public Vertex add(final Element element) {
        if (!canBePartOfTheGraph(element)) {
            return null;
        }

        final TypeElement typeElement = (TypeElement) element;
        final Vertex existingVertex = graph.get(typeElement);
        if (existingVertex != null) {
            return existingVertex;
        }

        graph.put(typeElement, new Vertex(typeElement));
        return graph.computeIfPresent(typeElement, (k, vertex) -> vertex.init());
    }

    private boolean canBePartOfTheGraph(final Element element) {
        return element != null && (element.getKind().isClass() || element.getKind().isInterface());
    }

    public Set<Vertex> findAllDependencies(final Set<? extends Element> elements) {
        return findAllConnections(elements, v -> v.dependencies, new HashSet<>());
    }

    public Set<Vertex> findAllDependents(final Set<? extends Element> elements) {
        return findAllConnections(elements, v -> v.dependents, new HashSet<>());
    }

    private Set<Vertex> findAllConnections(final Set<? extends Element> elements,
                                           final Function<Vertex, Set<Vertex>> connections,
                                           final Set<Vertex> visited) {

        final Set<Vertex> startingPoints = elements == null ? emptySet() : elements.stream()
                .filter(this::canBePartOfTheGraph)
                .map(graph::get)
                .filter(Objects::nonNull)
                .collect(toSet());

        final Set<Vertex> toBeVisited = diff(startingPoints, visited);
        visited.addAll(toBeVisited);

        return concat(startingPoints.stream(),
                      toBeVisited.stream()
                              .map(vertex -> connections.apply(vertex).stream().map(Vertex::getElement).collect(toSet()))
                              .flatMap(e -> findAllConnections(e, connections, visited).stream()))
                .collect(toSet());
    }

    public class Vertex {

        final Set<Vertex> dependencies;
        final Set<Vertex> dependents;
        private final PojoTsClass pojoClass;

        private Vertex(final TypeElement typeElement) {
            this.pojoClass = new PojoTsClass((DeclaredType) typeElement.asType());
            this.dependencies = new HashSet<>();
            this.dependents = new HashSet<>();
        }

        private Vertex init() {
            final Set<Vertex> dependencies = pojoClass.getDependencies().stream()
                    .map(DependencyGraph.this::add)
                    .filter(Objects::nonNull)
                    .collect(toSet());

            this.dependencies.addAll(dependencies);
            this.dependencies.forEach(d -> d.dependents.add(this));
            return this;
        }

        public PojoTsClass getPojoClass() {
            return pojoClass;
        }

        public TypeElement getElement() {
            return pojoClass.asElement();
        }

        @Override
        public String toString() {
            return pojoClass.getType().toString();
        }
    }

    Vertex vertex(final Element e) {
        if (!canBePartOfTheGraph(e)) {
            return null;
        }
        return graph.get(((TypeElement) e));
    }

    public Set<Vertex> vertices() {
        return new HashSet<>(graph.values());
    }

    private static <T> Set<T> diff(final Set<? extends T> a,
                                   final Set<? extends T> b) {

        final Set<T> tmp = new HashSet<>(a);
        tmp.removeAll(b);
        return tmp;
    }
}
