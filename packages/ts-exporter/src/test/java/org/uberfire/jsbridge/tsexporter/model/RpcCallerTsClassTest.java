package org.uberfire.jsbridge.tsexporter.model;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Stream;

import com.google.testing.compile.CompilationRule;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.decorators.ImportEntryForDecorator;
import org.uberfire.jsbridge.tsexporter.dependency.DependencyGraph;
import org.uberfire.jsbridge.tsexporter.meta.JavaType;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.NO_DECORATORS;
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

        Foo<String> someMethod();
    }

    @Test
    public void testDecorators() {

        final DependencyGraph dependencyGraph = new DependencyGraph(Stream.of(element(FooImpl2.class)),
                                                                    NO_DECORATORS);

        final RpcCallerTsClass tsClass = new RpcCallerTsClass(
                element(SomeInterface.class),
                dependencyGraph,
                new DecoratorStore(new HashSet<>(asList(
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/FooDEC", Foo.class.getCanonicalName()),
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/impl/FooImpl1DEC", FooImpl1.class.getCanonicalName()),
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/impl/FooImpl2DEC", FooImpl2.class.getCanonicalName()))
                )));

        assertEquals(
                lines("",
                      "import { rpc, marshall, unmarshall } from 'appformer-js';",
                      "import { FooDEC as decorators_pojo_FooDEC } from 'my-decorators';",
                      "import { FooImpl1DEC as decorators_pojo_impl_FooImpl1DEC } from 'my-decorators';",
                      "import { FooImpl2DEC as decorators_pojo_impl_FooImpl2DEC } from 'my-decorators';",
                      "",
                      "export class SomeInterface {",
                      "",
                      "public someMethod(args: {  }) {",
                      "  return rpc(\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.SomeInterface|someMethod:\", [])",
                      "         .then((json: string) => {",
                      "           return unmarshall(json, {",
                      "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl1\": (x: any) => new decorators_pojo_impl_FooImpl1DEC<any>(x),",
                      "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl2\": (x: any) => new decorators_pojo_impl_FooImpl2DEC(x)",
                      "           }) as decorators_pojo_FooDEC<string>;",
                      "         });",
                      "}",
                      "",
                      "}"),
                tsClass.toSource());
    }

    class FooImpl3 {

        FooImpl1 fooImpl1;
        FooImpl2 fooImpl2;
    }

    interface SomeOtherInterface {

        List<FooImpl3> someMethod();
    }

    @Test
    public void testDecoratorsIndirectly() {

        final DependencyGraph dependencyGraph = new DependencyGraph(Stream.of(element(FooImpl3.class)),
                                                                    NO_DECORATORS);

        final RpcCallerTsClass tsClass = new RpcCallerTsClass(
                element(SomeOtherInterface.class),
                dependencyGraph,
                new DecoratorStore(new HashSet<>(asList(
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/FooDEC", Foo.class.getCanonicalName()),
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/impl/FooImpl1DEC", FooImpl1.class.getCanonicalName()),
                        new ImportEntryForDecorator("my-pojos", "my-decorators", "decorators/pojo/impl/FooImpl2DEC", FooImpl2.class.getCanonicalName())
                ))));

        assertEquals(
                lines("",
                      "import { rpc, marshall, unmarshall } from 'appformer-js';",
                      "import { FooImpl1DEC as decorators_pojo_impl_FooImpl1DEC } from 'my-decorators';",
                      "import { FooImpl2DEC as decorators_pojo_impl_FooImpl2DEC } from 'my-decorators';",
                      "import { FooImpl3 as org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl3 } from '@kiegroup-ts-generated/ts-exporter-test';",
                      "",
                      "export class SomeOtherInterface {",
                      "",
                      "public someMethod(args: {  }) {",
                      "  return rpc(\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.SomeOtherInterface|someMethod:\", [])",
                      "         .then((json: string) => {",
                      "           return unmarshall(json, {",
                      "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl1\": (x: any) => new decorators_pojo_impl_FooImpl1DEC<any>(x),",
                      "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl2\": (x: any) => new decorators_pojo_impl_FooImpl2DEC(x),",
                      "\"org.uberfire.jsbridge.tsexporter.model.RpcCallerTsClassTest.FooImpl3\": (x: any) => new org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl3(x)",
                      "           }) as Array<org_uberfire_jsbridge_tsexporter_model_RpcCallerTsClassTest_FooImpl3>;",
                      "         });",
                      "}",
                      "",
                      "}"),
                tsClass.toSource());
    }
}
