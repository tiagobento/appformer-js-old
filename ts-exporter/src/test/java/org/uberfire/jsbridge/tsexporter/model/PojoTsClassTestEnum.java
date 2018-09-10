package org.uberfire.jsbridge.tsexporter.model;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PojoTsClassTestEnum {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
    }

    enum E {
        A,
        B,
        C
    }

    @Test
    public void testEnum() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(E.class));
        assertEquals(lines("",
                           "enum E { A, B, C }",
                           "",
                           "export default E;"),
                     pojoTsClass.toSource());
    }
}