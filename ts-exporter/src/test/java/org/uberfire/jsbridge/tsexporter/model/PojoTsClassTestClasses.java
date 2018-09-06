package org.uberfire.jsbridge.tsexporter.model;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;

import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.Utils.lines;

public class PojoTsClassTestClasses {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
        JavaType.SIMPLE_NAMES.set(true);
    }

    static class A {
    }

    public class B extends A {
        A a;
        B b;
        Integer c;
    }

    @Test
    public void testB() {
        JavaType.SIMPLE_NAMES.set(false);
        final PojoTsClass pojoTsClass = new PojoTsClass(type(B.class));
        assertEquals(lines("",
                           "import { Portable } from 'generated__temporary__/Model';",
                           "import JavaInteger from 'appformer/java-wrappers/JavaInteger';",
                           "import org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestClasses/A';",
                           "",
                           "export default  class B extends org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A implements Portable<B> {",
                           "",
                           "  protected readonly _fqcn: string = 'org.uberfire.jsbridge.tsexporter.model.PojoTsClassTestClasses.B';",
                           "",
                           "public readonly a?: org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A;",
                           "public readonly b?: B;",
                           "public readonly c?: JavaInteger;",
                           "",
                           "  constructor(self: { a?: org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A, b?: B, c?: JavaInteger, inherited?: {} }) {",
                           "    super({...self.inherited});",
                           "    Object.assign(this, self);",
                           "  }",
                           "}"),
                     pojoTsClass.toSource());
        JavaType.SIMPLE_NAMES.set(true);
    }
}