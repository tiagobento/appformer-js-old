package org.uberfire.jsbridge.tsexporter.model;

import com.google.testing.compile.CompilationRule;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorDependency;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;
import org.uberfire.jsbridge.tsexporter.meta.dependency.DependencyGraph;

import static java.util.Collections.singletonMap;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.element;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class RpcCallerTsClassTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
        JavaType.SIMPLE_NAMES.set(false);
    }

    @After
    public void after() {
        JavaType.SIMPLE_NAMES.set(false);
    }

    interface Foo<T> {

    }

    class FooImpl1<T> implements Foo<T> {

        String foo;
    }

    class FooImpl2 extends FooImpl1<String> {

        String bar;
    }

    interface SomeInterface {

        Foo<String> apiMethod();
    }

    @Test
    public void test() {

        final DependencyGraph dependencyGraph = new DependencyGraph();
        dependencyGraph.add(element(FooImpl2.class));

        final RpcCallerTsClass tsClass = new RpcCallerTsClass(
                element(SomeInterface.class),
                dependencyGraph,
                new DecoratorStore(singletonMap(Foo.class.getCanonicalName(), new DecoratorDependency(
                        "my-decorators",
                        "decorators/pojo/Bar",
                        Foo.class.getCanonicalName()))));

        assertEquals(lines("",
                           "import {rpc, marshall, unmarshall} from 'appformer/API';",
                           "import decorators_pojo_Bar from 'my-decorators/decorators/pojo/Bar';",
                           "import org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl1 from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/RpcCallerTsClassTest/FooImpl1';",
                           "import org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl2 from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/RpcCallerTsClassTest/FooImpl2';",
                           "",
                           "export default class SomeInterface {",
                           "",
                           "public apiMethod(args: {  }) {",
                           "  return rpc(\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.SomeInterface|apiMethod:\", [])",
                           "         .then((json: string) => {",
                           "           return unmarshall(json, {",
                           "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl1\": (x: any) => new org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl1<any>(x),",
                           "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl2\": (x: any) => new org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl2(x)",
                           "           }) as decorators_pojo_Bar<string>;",
                           "         });",
                           "}",
                           "",
                           "}"),
                     tsClass.toSource());
    }
}