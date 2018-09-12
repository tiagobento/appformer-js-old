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

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.TestingUtils;

import static java.util.Collections.singleton;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.TestingUtils.element;

public class DependencyGraphTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        TestingUtils.init(compilationRule.getTypes(), compilationRule.getElements());
    }

    interface A0 {

    }

    interface A1 extends A0 {

    }

    interface A2 extends A1 {

    }

    interface A1B1 extends A0,
                           B0 {

    }

    interface B0 {

    }

    interface A2B1 extends A1,
                           B0 {

    }

    @Test
    public void testSimpleGraphVertices() {
        final DependencyGraph graph = new DependencyGraph();
        graph.add(element(A0.class));
        assertEquals(1, graph.vertices().size());
        graph.add(element(A1.class));
        assertEquals(2, graph.vertices().size());
        graph.add(element(A2.class));
        assertEquals(3, graph.vertices().size());

        assertEquals(list(), simpleNames(graph.vertex(element(A0.class)).dependencies));
        assertEquals(list("A0"), simpleNames(graph.vertex(element(A1.class)).dependencies));
        assertEquals(list("A1"), simpleNames(graph.vertex(element(A2.class)).dependencies));

        assertEquals(list("A1"), simpleNames(graph.vertex(element(A0.class)).dependents));
        assertEquals(list("A2"), simpleNames(graph.vertex(element(A1.class)).dependents));
        assertEquals(list(), simpleNames(graph.vertex(element(A2.class)).dependents));
    }

    @Test
    public void testGraphVerticesComplex() {
        final DependencyGraph graph = new DependencyGraph();
        graph.add(element(A2B1.class));
        assertEquals(4, graph.vertices().size());
        graph.add(element(A1.class));
        assertEquals(4, graph.vertices().size());
        graph.add(element(B0.class));
        assertEquals(4, graph.vertices().size());
        graph.add(element(A1B1.class));
        assertEquals(5, graph.vertices().size());
        graph.add(element(A0.class));
        assertEquals(5, graph.vertices().size());
        graph.add(element(A2.class));
        assertEquals(6, graph.vertices().size());

        assertEquals(list(), simpleNames(graph.vertex(element(A0.class)).dependencies));
        assertEquals(list("A0"), simpleNames(graph.vertex(element(A1.class)).dependencies));
        assertEquals(list("A0", "B0"), simpleNames(graph.vertex(element(A1B1.class)).dependencies));
        assertEquals(list("A1"), simpleNames(graph.vertex(element(A2.class)).dependencies));
        assertEquals(list("A1", "B0"), simpleNames(graph.vertex(element(A2B1.class)).dependencies));
        assertEquals(list(), simpleNames(graph.vertex(element(B0.class)).dependencies));

        assertEquals(list("A1", "A1B1"), simpleNames(graph.vertex(element(A0.class)).dependents));
        assertEquals(list("A2", "A2B1"), simpleNames(graph.vertex(element(A1.class)).dependents));
        assertEquals(list(), simpleNames(graph.vertex(element(A1B1.class)).dependents));
        assertEquals(list(), simpleNames(graph.vertex(element(A2.class)).dependents));
        assertEquals(list(), simpleNames(graph.vertex(element(A2B1.class)).dependents));
        assertEquals(list("A1B1", "A2B1"), simpleNames(graph.vertex(element(B0.class)).dependents));
    }

    class c0 {

        c1 field;
    }

    class c1 {

        c0 field;
    }

    @Test
    public void testCycle() {
        final DependencyGraph graph = new DependencyGraph();
        graph.add(element(c0.class));
        assertEquals(2, graph.vertices().size());
        graph.add(element(c1.class));
        assertEquals(2, graph.vertices().size());

        assertEquals(list("c0", "c1"), simpleNames(graph.findAllDependencies(singleton(element(c0.class)))));
        assertEquals(list("c0", "c1"), simpleNames(graph.findAllDependencies(singleton(element(c1.class)))));

        assertEquals(list("c0", "c1"), simpleNames(graph.findAllDependents(singleton(element(c0.class)))));
        assertEquals(list("c0", "c1"), simpleNames(graph.findAllDependents(singleton(element(c1.class)))));
    }

    class a2b2 implements A1B1 {

        a3b2 field;
    }

    class a3b2 implements A2B1 {

        a2b2 field;
    }

    @Test
    public void testCycleComplex() {
        final DependencyGraph graph = new DependencyGraph();
        graph.add(element(a2b2.class));
        assertEquals(7, graph.vertices().size());
        graph.add(element(a3b2.class));
        assertEquals(7, graph.vertices().size());

        assertEquals(list("A0"), simpleNames(graph.findAllDependencies(singleton(element(A0.class)))));
        assertEquals(list("A0", "A1"), simpleNames(graph.findAllDependencies(singleton(element(A1.class)))));
        assertEquals(list("A0", "A1B1", "B0"), simpleNames(graph.findAllDependencies(singleton(element(A1B1.class)))));
        assertEquals(list("A0", "A1", "A2B1", "B0"), simpleNames(graph.findAllDependencies(singleton(element(A2B1.class)))));
        assertEquals(list("B0"), simpleNames(graph.findAllDependencies(singleton(element(B0.class)))));
        assertEquals(list("A0", "A1", "A1B1", "A2B1", "B0", "a2b2", "a3b2"), simpleNames(graph.findAllDependencies(singleton(element(a2b2.class)))));
        assertEquals(list("A0", "A1", "A1B1", "A2B1", "B0", "a2b2", "a3b2"), simpleNames(graph.findAllDependencies(singleton(element(a3b2.class)))));

        assertEquals(list("A0", "A1", "A1B1", "A2B1", "a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(A0.class)))));
        assertEquals(list("A1", "A2B1", "a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(A1.class)))));
        assertEquals(list("A1B1", "a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(A1B1.class)))));
        assertEquals(list("A2B1", "a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(A2B1.class)))));
        assertEquals(list("A1B1", "A2B1", "B0", "a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(B0.class)))));
        assertEquals(list("a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(a2b2.class)))));
        assertEquals(list("a2b2", "a3b2"), simpleNames(graph.findAllDependents(singleton(element(a3b2.class)))));
    }

    private static List<String> simpleNames(final Set<DependencyGraph.Vertex> vertex) {
        return ordered(vertex).stream().map(s -> s.getElement().getSimpleName().toString()).collect(toList());
    }

    private static <T> List<T> ordered(final Set<T> set) {
        return set.stream().sorted(comparing(Object::toString)).collect(toList());
    }

    @SafeVarargs
    private static <T> List<T> list(T... ts) {
        return Arrays.stream(ts).collect(toList());
    }
}
