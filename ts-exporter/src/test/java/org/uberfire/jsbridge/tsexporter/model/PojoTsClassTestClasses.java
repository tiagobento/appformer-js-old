package org.uberfire.jsbridge.tsexporter.model;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorImportEntry;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;

import static java.util.Arrays.asList;
import static java.util.Collections.emptySet;
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
    public void testNormalClass() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(B.class), new DecoratorStore(emptySet()));
        assertEquals(lines("",
                           "import Portable from 'appformer/internal/model/Portable';",
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
                           "public readonly c?: JavaInteger = new JavaInteger(\"0\");",
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
    }

    public class C extends A {

        A a;
        C c;
        Set<A> setA;
    }

    @Test
    public void testDecorators() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(C.class), new DecoratorStore(new HashSet<>(asList(
                new DecoratorImportEntry("my-decorators", "decorators/simple/CDEC", C.class.getCanonicalName()),
                new DecoratorImportEntry("my-decorators", "decorators/simple/ADEC", A.class.getCanonicalName())
        ))));

        assertEquals(lines("",
                           "import Portable from 'appformer/internal/model/Portable';",
                           "import decorators_simple_ADEC from 'my-decorators/decorators/simple/ADEC';",
                           "import decorators_simple_CDEC from 'my-decorators/decorators/simple/CDEC';",
                           "import org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestClasses/A';",
                           "",
                           "export default  class C extends org_uberfire_jsbridge_tsexporter_model_PojoTsClassTestClasses_A implements Portable<C> {",
                           "",
                           "  protected readonly _fqcn: string = 'org.uberfire.jsbridge.tsexporter.model.PojoTsClassTestClasses.C';",
                           "",
                           "public readonly a?: decorators_simple_ADEC;",
                           "public readonly c?: decorators_simple_CDEC;",
                           "public readonly setA?: Set<decorators_simple_ADEC>;",
                           "",
                           "  constructor(self: { a?: decorators_simple_ADEC, c?: decorators_simple_CDEC, setA?: Set<decorators_simple_ADEC>, inherited?: {} }) {",
                           "    super({...self.inherited});",
                           "    Object.assign(this, self);",
                           "  }",
                           "}"),
                     pojoTsClass.toSource());
    }
}