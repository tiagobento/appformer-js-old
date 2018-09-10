package org.uberfire.jsbridge.tsexporter.meta;

import java.util.AbstractList;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMultimap;
import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PackageJsonTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
    }

    @Test
    public void testNoDependencies() {
        final PackageJson packageJson = new PackageJson("test-module", emptyList());

        assertEquals(lines("{",
                           "  \"name\": \"test-module\",",
                           "  \"version\": \"1.0.0\",",
                           "  \"private\": true,",
                           "  \"license\": \"Apache-2.0\",",
                           "  \"dependencies\": {",
                           "",
                           "  }",
                           "}"),
                     packageJson.toSource());
    }


    private static abstract class A {
        ImmutableList<?> field;
    }

    private static abstract class B {
        ImmutableList<?> field1;
        ImmutableMultimap<?, ?> field2;
    }


    @Test
    public void testOneDependency() {
        final PackageJson packageJsonA = new PackageJson("test-module", singletonList(new PojoTsClass(type(A.class))));
        final PackageJson packageJsonB = new PackageJson("test-module", singletonList(new PojoTsClass(type(B.class))));

        assertEquals(lines("{",
                           "  \"name\": \"test-module\",",
                           "  \"version\": \"1.0.0\",",
                           "  \"private\": true,",
                           "  \"license\": \"Apache-2.0\",",
                           "  \"dependencies\": {",
                           "\"guava\": \"file:../guava\"",
                           "  }",
                           "}"),
                     packageJsonA.toSource());

        assertEquals(packageJsonA.toSource(), packageJsonB.toSource());
    }

    private static abstract class C {
        ImmutableList<?> field1;
        AbstractList<?> field2;
    }

    @Test
    public void testTwoDependencies() {
        final PackageJson packageJsonC = new PackageJson("test-module", singletonList(new PojoTsClass(type(C.class))));

        assertEquals(lines("{",
                           "  \"name\": \"test-module\",",
                           "  \"version\": \"1.0.0\",",
                           "  \"private\": true,",
                           "  \"license\": \"Apache-2.0\",",
                           "  \"dependencies\": {",
                           "\"java\": \"file:../java\",",
                           "\"guava\": \"file:../guava\"",
                           "  }",
                           "}"),
                     packageJsonC.toSource());
    }
}