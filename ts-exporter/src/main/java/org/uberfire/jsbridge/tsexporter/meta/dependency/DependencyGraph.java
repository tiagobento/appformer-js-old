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

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;

import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;

import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.util.Utils;

import static java.util.Arrays.*;
import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;

public class DependencyGraph {

    private final Map<TypeElement, Vertex> graph;
    private final DecoratorStore decoratorStore;

    public DependencyGraph(final DecoratorStore decoratorStore) {
        this.decoratorStore = decoratorStore;
        graph = new HashMap<>();
    }

    public Vertex add(final Dependency dependency) {
        if (dependency instanceof JavaDependency) {
            return add(((JavaDependency) dependency).getDeclaredType().asElement());
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

    public Set<Vertex> findAllDependencies(final Set<? extends Element> elements, final Dependency.Kind... kinds) {
        return findAllConnections(elements, v -> v.dependencies, new HashSet<>(), new HashSet<>(asList(kinds.length == 0 ? Dependency.Kind.values() : kinds)));
    }

    public Set<Vertex> findAllDependents(final Set<? extends Element> elements, final Dependency.Kind... kinds) {
        return findAllConnections(elements, v -> v.dependents, new HashSet<>(), new HashSet<>(asList(kinds.length == 0 ? Dependency.Kind.values() : kinds)));
    }

    private Set<Vertex> findAllConnections(final Set<? extends Element> elements,
                                           final Function<Vertex, Map<Vertex, Set<Dependency.Kind>>> connections,
                                           final Set<Vertex> visited,
                                           final Set<Dependency.Kind> kinds) {

        final Set<Vertex> startingPoints = elements == null ? emptySet() : elements.stream()
                .filter(this::canBePartOfTheGraph)
                .map(e -> ((TypeElement) e))
                .map(graph::get)
                .filter(Objects::nonNull)
                .collect(toSet());

        final Set<Vertex> toBeVisited = Utils.diff(startingPoints, visited);
        visited.addAll(toBeVisited);

        return concat(startingPoints.stream(),
                      toBeVisited.stream()
                              .map(vertex -> connections.apply(vertex).entrySet().stream()
                                      .filter(e -> e.getValue().stream().anyMatch(kinds::contains))
                                      .map(Map.Entry::getKey).map(Vertex::getElement)
                                      .collect(toSet()))
                              .flatMap(e -> findAllConnections(e, connections, visited, kinds).stream()))
                .collect(toSet());
    }

    public class Vertex {

        final Map<Vertex, Set<Dependency.Kind>> dependencies;
        final Map<Vertex, Set<Dependency.Kind>> dependents;
        private final PojoTsClass pojoClass;

        private Vertex(final TypeElement typeElement) {
            this.pojoClass = new PojoTsClass((DeclaredType) typeElement.asType(), decoratorStore);
            this.dependencies = new HashMap<>();
            this.dependents = new HashMap<>();
        }

        private Vertex init() {
            final Map<Vertex, Set<Dependency.Kind>> dependencies = pojoClass.getDependencies().stream()
                    .collect(toMap(relation -> DependencyGraph.this.add(relation.dependency),
                                   relation -> relation.kinds,
                                   (prev, curr) -> concat(prev.stream(), curr.stream()).collect(toSet())));

            dependencies.remove(null);

            this.dependencies.putAll(dependencies);
            this.dependencies.forEach((vertex, kinds) -> vertex.dependents.merge(this, kinds, (prev, curr) -> concat(prev.stream(), curr.stream()).collect(toSet())));
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
}
