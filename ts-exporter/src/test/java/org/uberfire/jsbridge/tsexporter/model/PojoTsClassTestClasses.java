package org.uberfire.jsbridge.tsexporter.model;

import java.util.LinkedList;
import java.util.Optional;
import java.util.TreeMap;
import java.util.TreeSet;

import com.google.testing.compile.CompilationRule;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;

import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PojoTsClassTestClasses {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
        JavaType.SIMPLE_NAMES.set(true);
    }

    @After
    public void after() {
        JavaType.SIMPLE_NAMES.set(false);
    }

    static class A {

    }

    public class B extends A {

        A a;
        B b;
        Integer c;
        TreeSet<String> d;
        LinkedList<String> e;
        TreeMap<String, String> f;
        Optional<TreeSet<String>> g;
    }

    @Test
    public void testB() {
        JavaType.SIMPLE_NAMES.set(false);
        final PojoTsClass pojoTsClass = new PojoTsClass(type(B.class));
        assertEquals(lines("",
                           "import { Portable } from 'generated__temporary__/Model';",
                           "import JavaInteger from 'appformer/java-wrappers/JavaInteger';",
                           "import JavaLinkedList from 'appformer/java-wrappers/JavaLinkedList';",
                           "import JavaOptional from 'appformer/java-wrappers/JavaOptional';",
                           "import JavaTreeMap from 'appformer/java-wrappers/JavaTreeMap';",
                           "import JavaTreeSet from 'appformer/java-wrappers/JavaTreeSet';",
                           "import org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestClasses/A';",
                           "",
                           "export default  class B extends org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A implements Portable<B> {",
                           "",
                           "  protected readonly _fqcn: string = 'org.uberfire.jsbridge.tsexporter.model.PojoTsClassTestClasses.B';",
                           "",
                           "public readonly a?: org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A;",
                           "public readonly b?: B;",
                           "public readonly c?: JavaInteger;",
                           "public readonly d?: JavaTreeSet<string>;",
                           "public readonly e?: JavaLinkedList<string>;",
                           "public readonly f?: JavaTreeMap<string, string>;",
                           "public readonly g?: JavaOptional<JavaTreeSet<string>>;",
                           "",
                           "  constructor(self: { a?: org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A, b?: B, c?: JavaInteger, d?: JavaTreeSet<string>, e?: JavaLinkedList<string>, f?: JavaTreeMap<string, string>, g?: JavaOptional<JavaTreeSet<string>>, inherited?: {} }) {",
                           "    super({...self.inherited});",
                           "    Object.assign(this, self);",
                           "  }",
                           "}"),
                     pojoTsClass.toSource());
        JavaType.SIMPLE_NAMES.set(true);
    }
}