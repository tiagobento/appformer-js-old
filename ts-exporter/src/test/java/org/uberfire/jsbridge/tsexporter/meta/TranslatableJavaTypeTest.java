package org.uberfire.jsbridge.tsexporter.meta;

import java.util.List;

import javax.lang.model.type.DeclaredType;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.util.ImportStore;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.*;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.member;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.type;

public class TranslatableJavaTypeTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        TestingUtils.init(compilationRule.getTypes(), compilationRule.getElements());
    }

    @Test
    public void testDependencies() {
        final ImportStore store = new ImportStore();

        final List<DeclaredType> dependencies0 = store.with(
                member("field2", type(TestingUtils.Sphere.class)).translate())
                .getDependencies();
        assertEquals(2, dependencies0.size());
        assertTrue(dependencies0.get(0).toString().endsWith("Circle<T>"));
        assertTrue(dependencies0.get(1).toString().endsWith("Sphere<J>"));


        final List<DeclaredType> dependencies1 = store.with(
                translatable(type(TestingUtils.Circle.class)))
                .getDependencies();
        assertEquals(2, dependencies1.size());
        assertTrue(dependencies1.get(0).toString().endsWith("Circle<T>"));
        assertTrue(dependencies1.get(1).toString().endsWith("Circle<T>"));

        final List<DeclaredType> dependencies2 = store.with(
                translatable(type(TestingUtils.Circle.class), TYPE_ARGUMENT_USE))
                .getDependencies();
        assertEquals(1, dependencies2.size());
        assertTrue(dependencies2.get(0).toString().endsWith("Circle<T>"));

        final List<ImportableTsType> imports = store.getImports();
        assertEquals(2, imports.size());
        assertEquals("ts-exporter-test", imports.get(0).getModuleName());
        assertTrue(imports.get(0).getType().toString().endsWith("Circle"));
        assertEquals("ts-exporter-test", imports.get(1).getModuleName());
        assertTrue(imports.get(1).getType().toString().endsWith("Sphere"));
    }

    private TranslatableJavaType translatable(final DeclaredType type) {
        return new JavaType(type).translate();
    }

    private TranslatableJavaType translatable(final DeclaredType type, final TsTypeTarget target) {
        return new JavaType(type).translate(target);
    }
}