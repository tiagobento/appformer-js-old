package org.uberfire.jsbridge.tsexporter.meta;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.lang.model.type.DeclaredType;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.meta.dependency.Dependency;
import org.uberfire.jsbridge.tsexporter.meta.dependency.ImportStore;
import org.uberfire.jsbridge.tsexporter.model.PojoTsClass;
import org.uberfire.jsbridge.tsexporter.util.TestingUtils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.*;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.member;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;

public class TranslatableJavaTypeTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        TestingUtils.init(compilationRule.getTypes(), compilationRule.getElements());
    }

    @Test
    public void testAggregated() {
        final ImportStore store = new ImportStore();

        final List<Dependency> aggregated0 = store.with(
                member("field2", type(TestingUtils.Sphere.class)).translate(TYPE_ARGUMENT_DECLARATION, NO_DECORATORS))
                .getAggregated();
        assertEquals(2, aggregated0.size());
        assertTrue(aggregated0.get(0).toString().endsWith("Circle<T>"));
        assertTrue(aggregated0.get(1).toString().endsWith("Sphere<J>"));

        final List<Dependency> aggregated1 = store.with(
                translatable(type(TestingUtils.Circle.class)))
                .getAggregated();
        assertEquals(2, aggregated1.size());
        assertTrue(aggregated1.get(0).toString().endsWith("Circle<T>"));
        assertTrue(aggregated1.get(1).toString().endsWith("Circle<T>"));

        final List<Dependency> aggregated2 = store.with(
                translatable(type(TestingUtils.Circle.class), TYPE_ARGUMENT_USE))
                .getAggregated();
        assertEquals(1, aggregated2.size());
        assertTrue(aggregated2.get(0).toString().endsWith("Circle<T>"));

        List<Dependency> aggregated3 = store.with(
                member("get6", type(TestingUtils.Circle.class)).translate(TYPE_ARGUMENT_DECLARATION, NO_DECORATORS))
                .getAggregated();
        assertEquals(1, aggregated3.size());
        assertTrue(aggregated3.get(0).toString().endsWith("Circle<T>"));

        final List<Dependency> imports = store.getImports(new PojoTsClass(type(TranslatableJavaTypeTest.class), NO_DECORATORS)).stream().sorted(Comparator.comparing(Dependency::sourcePath)).collect(Collectors.toList());
        assertEquals(2, imports.size());
        assertTrue(imports.get(0).toString().endsWith("Circle<T>"));
        assertTrue(imports.get(1).toString().endsWith("Sphere<J>"));
    }

    private JavaType.Translatable translatable(final DeclaredType type) {
        return new JavaType(type, type).translate(TYPE_ARGUMENT_DECLARATION, NO_DECORATORS);
    }

    private JavaType.Translatable translatable(final DeclaredType type,
                                               final TsTypeTarget target) {

        return new JavaType(type, type).translate(target, NO_DECORATORS);
    }
}