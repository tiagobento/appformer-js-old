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

package org.uberfire.jsbridge.tsexporter.meta;

import java.util.List;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.meta.hierarchy.DependencyGraph;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.element;

public class DependencyGraphTest {

    public interface A0 {

    }

    public interface A1 extends A0 {

    }

    public interface A2 extends A1 {

    }

    public interface A1B1 extends A0,
                                  B0 {

    }

    public interface B0 {

    }

    public interface A2B1 extends A1,
                                  B0 {

    }

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        TestingUtils.init(compilationRule.getTypes(), compilationRule.getElements());
        JavaType.SIMPLE_NAMES = true;
    }

    @Test
    public void test1() {
        final DependencyGraph depGraph = new DependencyGraph();
        depGraph.add(element(A0.class));
        assertEquals(1, orderedVertexes(depGraph).size());
        depGraph.add(element(A1.class));
        assertEquals(2, orderedVertexes(depGraph).size());
        depGraph.add(element(A2.class));
        assertEquals(3, orderedVertexes(depGraph).size());

        final List<DependencyGraph.Vertex> vertexes = orderedVertexes(depGraph);
        assertEquals(0, vertexes.get(0).getAdjacencies().size());
        assertEquals(1, vertexes.get(1).getAdjacencies().size());
        assertEquals(1, vertexes.get(2).getAdjacencies().size());
    }

    @Test
    public void test2() {
        final DependencyGraph depGraph = new DependencyGraph();
        depGraph.add(element(A2B1.class));
        assertEquals(4, orderedVertexes(depGraph).size());
        depGraph.add(element(A1.class));
        assertEquals(4, orderedVertexes(depGraph).size());
        depGraph.add(element(B0.class));
        assertEquals(4, orderedVertexes(depGraph).size());
        depGraph.add(element(A1B1.class));
        assertEquals(5, orderedVertexes(depGraph).size());
        depGraph.add(element(A0.class));
        assertEquals(5, orderedVertexes(depGraph).size());
        depGraph.add(element(A2.class));
        assertEquals(6, orderedVertexes(depGraph).size());

        final List<DependencyGraph.Vertex> vertexes = orderedVertexes(depGraph);
        assertEquals(0, vertexes.get(0).getAdjacencies().size());
        assertEquals(1, vertexes.get(1).getAdjacencies().size());
        assertEquals(2, vertexes.get(2).getAdjacencies().size());
        assertEquals(1, vertexes.get(3).getAdjacencies().size());
        assertEquals(2, vertexes.get(4).getAdjacencies().size());
        assertEquals(0, vertexes.get(5).getAdjacencies().size());
    }

    private static List<DependencyGraph.Vertex> orderedVertexes(DependencyGraph depGraph) {
        return depGraph.vertices().stream().sorted(comparing(DependencyGraph.Vertex::toString)).collect(toList());
    }
}
