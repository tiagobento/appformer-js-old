package org.uberfire.jsbridge.tsexporter.meta;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.lang.model.element.TypeElement;
import javax.lang.model.type.TypeMirror;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;

import static javax.lang.model.type.TypeKind.BOOLEAN;
import static javax.lang.model.type.TypeKind.BYTE;
import static javax.lang.model.type.TypeKind.CHAR;
import static javax.lang.model.type.TypeKind.DOUBLE;
import static javax.lang.model.type.TypeKind.FLOAT;
import static javax.lang.model.type.TypeKind.INT;
import static javax.lang.model.type.TypeKind.LONG;
import static javax.lang.model.type.TypeKind.SHORT;
import static javax.lang.model.type.TypeKind.VOID;
import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.array;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.erased;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.member;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.param;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.primitive;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.types;
import static org.uberfire.jsbridge.tsexporter.meta.TestingUtils.wildcard;

public class JavaTypeTest {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        TestingUtils.init(compilationRule.getTypes(), compilationRule.getElements());
        JavaType.simpleNames = true;
    }

    @Test
    public void testPrimitives() {
        assertEquals("number", translate(primitive(INT)));
        assertEquals("number", translate(primitive(BYTE)));
        assertEquals("number", translate(primitive(DOUBLE)));
        assertEquals("number", translate(primitive(FLOAT)));
        assertEquals("number", translate(primitive(SHORT)));
        assertEquals("number", translate(primitive(LONG)));
        assertEquals("void", translate(types.getNoType(VOID)));
        assertEquals("string", translate(primitive(CHAR)));
        assertEquals("boolean", translate(primitive(BOOLEAN)));
        assertEquals("null", translate(types.getNullType()));
    }

    @Test
    public void testArray() {
        assertEquals("number[]", translate(array(primitive(INT))));
        assertEquals("number[][]", translate(array(array(primitive(INT)))));
        assertEquals("string[]", translate(array(type(String.class))));
        assertEquals("Map<any, any>[]", translate(array(erased(type(Map.class)))));
        assertEquals("E[][]", translate(array(type(List.class))));
        assertEquals("any[][]", translate(array(erased(type(List.class)))));
    }

    private abstract class Circle<T extends Circle<T>> {

        T field1;
        Circle<T> field2;

        abstract void get1(T t);

        abstract <U> void get2(T t, U u);

        abstract <U extends T> void get3(T t, U u);

        abstract <U extends T, S extends U> void get4(T t, U u, S s);

        abstract <U extends T, S extends List<? extends T>> void get5(T t, U u, S s);

        abstract <U extends T, S extends Circle<T>> void get6(T t, U u, S s);

        abstract <U extends T, S extends Circle<T>> void get7(T t, U u, S s);
    }

    private abstract class Cylinder extends Circle<Cylinder> {

    }

    private abstract class Sphere<J> extends Circle<Sphere<J>> {

    }

    @Test
    public void testTypeVar() {
        assertEquals("Circle<T extends Circle<T>>", translate(type(Circle.class)));
        assertEquals("Circle<T>", translate(TYPE_ARGUMENT_USE, type(Circle.class)));
        assertEquals("T extends Circle<T>", translate(member("field1", type(Circle.class))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, member("field1", type(Circle.class))));
        assertEquals("Circle<T extends Circle<T>>", translate(member("field2", type(Circle.class))));
        assertEquals("Circle<T>", translate(TYPE_ARGUMENT_USE, member("field2", type(Circle.class))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(Circle.class)))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(Circle.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(Circle.class)))));

        assertEquals("Cylinder", translate(type(Cylinder.class)));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, type(Cylinder.class)));
        assertEquals("Circle<Cylinder>", translate(((TypeElement) type(Cylinder.class).asElement()).getSuperclass()));
        assertEquals("Circle<Cylinder>", translate(TYPE_ARGUMENT_USE, ((TypeElement) type(Cylinder.class).asElement()).getSuperclass()));
        assertEquals("Cylinder", translate(member("field1", type(Cylinder.class))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, member("field1", type(Cylinder.class))));
        assertEquals("Circle<Cylinder>", translate(member("field2", type(Cylinder.class))));
        assertEquals("Circle<Cylinder>", translate(TYPE_ARGUMENT_USE, member("field2", type(Cylinder.class))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(Cylinder.class)))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(Cylinder.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(Cylinder.class)))));

        assertEquals("Sphere<J>", translate(type(Sphere.class)));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, type(Sphere.class)));
        assertEquals("Circle<Sphere<J>>", translate(((TypeElement) type(Sphere.class).asElement()).getSuperclass()));
        assertEquals("Circle<Sphere<J>>", translate(TYPE_ARGUMENT_USE, ((TypeElement) type(Sphere.class).asElement()).getSuperclass()));
        assertEquals("Sphere<J>", translate(member("field1", type(Sphere.class))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, member("field1", type(Sphere.class))));
        assertEquals("Circle<Sphere<J>>", translate(member("field2", type(Sphere.class))));
        assertEquals("Circle<Sphere<J>>", translate(TYPE_ARGUMENT_USE, member("field2", type(Sphere.class))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(Sphere.class)))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(Sphere.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(Sphere.class)))));
    }

    private abstract class DeclaredTypes {

        Map<String, String> map;
        List<String> list;
        ArrayList<String> arrayList;
        LinkedList<String> linkedList;
        Set<String> set;
        HashSet<String> hashSet;
        Collection<String> collection;
        Class<String> clazz;
    }

    private static class Foo {

        private static class Bar {

        }
    }

    @Test
    public void testDeclared() {
        assertEquals("any /* object */", translate(type(Object.class)));
        assertEquals("any /* date */", translate(type(Date.class)));
        assertEquals("any /* throwable */", translate(type(Throwable.class)));
        //TODO: javax.enterprise.event.Event: WHY?
        assertEquals("boolean", translate(type(Boolean.class)));
        assertEquals("string", translate(type(String.class)));
        assertEquals("number", translate(type(Integer.class)));
        assertEquals("number", translate(type(Byte.class)));
        assertEquals("number", translate(type(Double.class)));
        assertEquals("number", translate(type(Float.class)));
        assertEquals("number", translate(type(Long.class)));
        assertEquals("number", translate(type(Number.class)));
        assertEquals("number", translate(type(Short.class)));
        assertEquals("any /* class */", translate(type(Class.class)));
        assertEquals("any /* map entry */", translate(type(Map.Entry.class)));
        //TODO: HashMap.Node: It's protected! How?
        assertEquals("Map<any, any>", translate(erased(type(HashMap.class))));
        assertEquals("Map<any, any>", translate(erased(type(Map.class))));
        assertEquals("any[]", translate(erased(type(Set.class))));
        assertEquals("any[]", translate(erased(type(HashSet.class))));
        assertEquals("any[]", translate(erased(type(List.class))));
        assertEquals("any[]", translate(erased(type(ArrayList.class))));
        assertEquals("any[]", translate(erased(type(LinkedList.class))));
        assertEquals("any[]", translate(erased(type(Collection.class))));
        assertEquals("Foo", translate(type(Foo.class)));
        assertEquals("Bar", translate(type(Foo.Bar.class)));
        assertEquals("Circle<any>", translate(erased(type(Circle.class))));

        assertEquals("string[]", translate(member("set", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("hashSet", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("list", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("arrayList", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("linkedList", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("collection", type(DeclaredTypes.class))));
        assertEquals("any /* class */", translate(member("clazz", type(DeclaredTypes.class))));
    }

    @Test
    public void testWildcard() {
        assertEquals("any /* wildcard */", translate(wildcard(null, null)));
        assertEquals("string", translate(wildcard(type(String.class), null)));
        assertEquals("Partial<string>", translate(wildcard(null, type(String.class))));
        assertEquals("Partial<Map<any, any>>", translate(wildcard(null, erased(type(Map.class)))));
    }

    @Test
    public void testExecutable() {
        assertEquals("", translate(member("get1", type(Circle.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(Circle.class))));
        assertEquals("<U>", translate(member("get2", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Circle.class))));
        assertEquals("<U extends T>", translate(member("get3", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Circle.class))));
        assertEquals("<U extends T, S extends U>", translate(member("get4", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Circle.class))));
        assertEquals("<U extends T, S extends T[]>", translate(member("get5", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Circle.class))));
        assertEquals("<U extends T, S extends Circle<T>>", translate(member("get6", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Circle.class))));

        assertEquals("", translate(member("get1", type(Cylinder.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(Cylinder.class))));
        assertEquals("<U>", translate(member("get2", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Cylinder.class))));
        assertEquals("<U extends Cylinder>", translate(member("get3", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends U>", translate(member("get4", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Cylinder[]>", translate(member("get5", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Circle<Cylinder>>", translate(member("get6", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Cylinder.class))));

        assertEquals("", translate(member("get1", type(Sphere.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(Sphere.class))));
        assertEquals("<U>", translate(member("get2", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>>", translate(member("get3", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends U>", translate(member("get4", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Sphere<J>[]>", translate(member("get5", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Circle<Sphere<J>>>", translate(member("get6", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Sphere.class))));
    }

    private String translate(final TypeMirror type) {
        return translate(new JavaType(type));
    }

    private String translate(final JavaType type) {
        return type.toUniqueTsType();
    }

    private String translate(final TsTypeTarget tsTypeTarget, final TypeMirror type) {
        return translate(tsTypeTarget, new JavaType(type));
    }

    private String translate(final TsTypeTarget tsTypeTarget, final JavaType type) {
        return type.toUniqueTsType(tsTypeTarget);
    }
}