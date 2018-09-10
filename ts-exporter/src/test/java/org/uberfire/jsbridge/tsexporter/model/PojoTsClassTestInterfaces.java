package org.uberfire.jsbridge.tsexporter.model;

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

public class PojoTsClassTestInterfaces {

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

    interface A {

    }

    @Test
    public void testInterfaceA() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(A.class));
        assertEquals(lines("",
                           "",
                           "",
                           "export default interface A  {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface B extends A {

    }

    @Test
    public void testInterfaceB() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(B.class));
        assertEquals(lines("",
                           "import A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/A';",
                           "",
                           "export default interface B extends A {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface C<T> {

    }

    @Test
    public void testInterfaceC() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(C.class));
        assertEquals(lines("",
                           "",
                           "",
                           "export default interface C<T>  {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface D<T extends A> {

    }

    @Test
    public void testInterfaceD() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(D.class));
        assertEquals(lines("",
                           "import A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/A';",
                           "",
                           "export default interface D<T extends A>  {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface E<J extends D<A>> {

    }

    @Test
    public void testInterfaceE() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(E.class));
        assertEquals(lines("",
                           "import A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/A';",
                           "import D from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/D';",
                           "",
                           "export default interface E<J extends D<A>>  {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface F<B extends F<?>> {

    }

    @Test
    public void testInterfaceF() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(F.class));
        assertEquals(lines("",
                           "",
                           "",
                           "export default interface F<B extends F<any /* wildcard */>>  {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface G<T> extends A {

    }

    @Test
    public void testInterfaceG() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(G.class));
        assertEquals(lines("",
                           "import A from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/A';",
                           "",
                           "export default interface G<T> extends A {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface H<T> extends C<T> {

    }

    @Test
    public void testInterfaceH() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(H.class));
        assertEquals(lines("",
                           "import C from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/C';",
                           "",
                           "export default interface H<T> extends C<T> {",
                           "}"),
                     pojoTsClass.toSource());
    }

    interface I<T extends C<I>> extends H<T> {

    }

    @Test
    public void testInterfaceI() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(I.class));
        assertEquals(lines("",
                           "import C from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/C';",
                           "import H from 'output/ts-exporter-test/org/uberfire/jsbridge/tsexporter/model/PojoTsClassTestInterfaces/H';",
                           "",
                           "export default interface I<T extends C<I<any>>> extends H<T> {",
                           "}"),
                     pojoTsClass.toSource());
    }
}