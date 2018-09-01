package org.uberfire.jsbridge.tsexporter.meta;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

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
import static org.junit.Assert.assertTrue;
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
        JavaType.SIMPLE_NAMES = true;
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

    @Test
    public void testTypeVar() {
        assertEquals("Circle<T extends Circle<T>>", translate(type(TestingUtils.Circle.class)));
        assertEquals("Circle<T>", translate(TYPE_ARGUMENT_USE, type(TestingUtils.Circle.class)));
        assertEquals("T extends Circle<T>", translate(member("field1", type(TestingUtils.Circle.class))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, member("field1", type(TestingUtils.Circle.class))));
        assertEquals("Circle<T extends Circle<T>>", translate(member("field2", type(TestingUtils.Circle.class))));
        assertEquals("Circle<T>", translate(TYPE_ARGUMENT_USE, member("field2", type(TestingUtils.Circle.class))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(TestingUtils.Circle.class)))));
        assertEquals("T", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(TestingUtils.Circle.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(TestingUtils.Circle.class)))));

        assertEquals("Cylinder", translate(type(TestingUtils.Cylinder.class)));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, type(TestingUtils.Cylinder.class)));
        assertEquals("Circle<Cylinder>", translate(((TypeElement) type(TestingUtils.Cylinder.class).asElement()).getSuperclass()));
        assertEquals("Circle<Cylinder>", translate(TYPE_ARGUMENT_USE, ((TypeElement) type(TestingUtils.Cylinder.class).asElement()).getSuperclass()));
        assertEquals("Cylinder", translate(member("field1", type(TestingUtils.Cylinder.class))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, member("field1", type(TestingUtils.Cylinder.class))));
        assertEquals("Circle<Cylinder>", translate(member("field2", type(TestingUtils.Cylinder.class))));
        assertEquals("Circle<Cylinder>", translate(TYPE_ARGUMENT_USE, member("field2", type(TestingUtils.Cylinder.class))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(TestingUtils.Cylinder.class)))));
        assertEquals("Cylinder", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(TestingUtils.Cylinder.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(TestingUtils.Cylinder.class)))));

        assertEquals("Sphere<J>", translate(type(TestingUtils.Sphere.class)));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, type(TestingUtils.Sphere.class)));
        assertEquals("Circle<Sphere<J>>", translate(((TypeElement) type(TestingUtils.Sphere.class).asElement()).getSuperclass()));
        assertEquals("Circle<Sphere<J>>", translate(TYPE_ARGUMENT_USE, ((TypeElement) type(TestingUtils.Sphere.class).asElement()).getSuperclass()));
        assertEquals("Sphere<J>", translate(member("field1", type(TestingUtils.Sphere.class))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, member("field1", type(TestingUtils.Sphere.class))));
        assertEquals("Circle<Sphere<J>>", translate(member("field2", type(TestingUtils.Sphere.class))));
        assertEquals("Circle<Sphere<J>>", translate(TYPE_ARGUMENT_USE, member("field2", type(TestingUtils.Sphere.class))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, param(0, member("get1", type(TestingUtils.Sphere.class)))));
        assertEquals("Sphere<J>", translate(TYPE_ARGUMENT_USE, param(0, member("get2", type(TestingUtils.Sphere.class)))));
        assertEquals("U", translate(TYPE_ARGUMENT_USE, param(1, member("get2", type(TestingUtils.Sphere.class)))));
    }

    @Test
    public void testDeclared() {
        assertEquals("any /* object */", translate(type(Object.class)));
        assertEquals("any /* date */", translate(type(Date.class)));
        assertEquals("any /* stack trace element */", translate(type(StackTraceElement.class)));
        assertEquals("any /* throwable */", translate(type(Throwable.class)));
        //TODO: javax.enterprise.event.Event: WHY?
        assertEquals("boolean", translate(type(Boolean.class)));
        assertEquals("string", translate(type(Character.class)));
        assertEquals("string", translate(type(String.class)));
        assertEquals("number", translate(type(Integer.class)));
        assertEquals("number", translate(type(Byte.class)));
        assertEquals("number", translate(type(Double.class)));
        assertEquals("number", translate(type(Float.class)));
        assertEquals("number", translate(type(Long.class)));
        assertEquals("number", translate(type(Number.class)));
        assertEquals("number", translate(type(Short.class)));
        assertEquals("number", translate(type(BigInteger.class)));
        assertEquals("number", translate(type(BigDecimal.class)));
        assertEquals("number", translate(type(OptionalInt.class)));
        assertEquals("any /* class */", translate(type(Class.class)));
        assertEquals("any /* enum_ */", translate(type(Enum.class)));
        assertEquals("any /* map entry */", translate(type(Map.Entry.class)));
        //TODO: HashMap.Node: It's protected! How?
        assertEquals("Map<any, any>", translate(erased(type(HashMap.class))));
        assertEquals("Map<any, any>", translate(erased(type(TreeMap.class))));
        assertEquals("Map<any, any>", translate(erased(type(Map.class))));
        assertEquals("any[]", translate(erased(type(Set.class))));
        assertEquals("any[]", translate(erased(type(HashSet.class))));
        assertEquals("any[]", translate(erased(type(TreeSet.class))));
        assertEquals("any[]", translate(erased(type(List.class))));
        assertEquals("any[]", translate(erased(type(ArrayList.class))));
        assertEquals("any[]", translate(erased(type(LinkedList.class))));
        assertEquals("any[]", translate(erased(type(Collection.class))));
        assertEquals("Foo", translate(type(TestingUtils.Foo.class)));
        assertEquals("Bar", translate(type(TestingUtils.Foo.Bar.class)));
        assertEquals("Circle<any>", translate(erased(type(TestingUtils.Circle.class))));
        assertEquals("any", translate(erased(type(Optional.class))));

        assertEquals("string[]", translate(member("set", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("hashSet", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("treeSet", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("list", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("arrayList", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("linkedList", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string[]", translate(member("collection", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("any /* class */", translate(member("clazz", type(TestingUtils.DeclaredTypes.class))));
        assertEquals("string", translate(member("optional", type(TestingUtils.DeclaredTypes.class))));
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
        assertEquals("", translate(member("get1", type(TestingUtils.Circle.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(TestingUtils.Circle.class))));
        assertEquals("<U>", translate(member("get2", type(TestingUtils.Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(TestingUtils.Circle.class))));
        assertEquals("<U extends T>", translate(member("get3", type(TestingUtils.Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(TestingUtils.Circle.class))));
        assertEquals("<U extends T, S extends U>", translate(member("get4", type(TestingUtils.Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(TestingUtils.Circle.class))));
        assertEquals("<U extends T, S extends T[]>", translate(member("get5", type(TestingUtils.Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(TestingUtils.Circle.class))));
        assertEquals("<U extends T, S extends Circle<T>>", translate(member("get6", type(TestingUtils.Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(TestingUtils.Circle.class))));

        assertEquals("", translate(member("get1", type(TestingUtils.Cylinder.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(TestingUtils.Cylinder.class))));
        assertEquals("<U>", translate(member("get2", type(TestingUtils.Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(TestingUtils.Cylinder.class))));
        assertEquals("<U extends Cylinder>", translate(member("get3", type(TestingUtils.Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(TestingUtils.Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends U>", translate(member("get4", type(TestingUtils.Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(TestingUtils.Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Cylinder[]>", translate(member("get5", type(TestingUtils.Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(TestingUtils.Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Circle<Cylinder>>", translate(member("get6", type(TestingUtils.Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(TestingUtils.Cylinder.class))));

        assertEquals("", translate(member("get1", type(TestingUtils.Sphere.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(TestingUtils.Sphere.class))));
        assertEquals("<U>", translate(member("get2", type(TestingUtils.Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(TestingUtils.Sphere.class))));
        assertEquals("<U extends Sphere<J>>", translate(member("get3", type(TestingUtils.Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(TestingUtils.Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends U>", translate(member("get4", type(TestingUtils.Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(TestingUtils.Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Sphere<J>[]>", translate(member("get5", type(TestingUtils.Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(TestingUtils.Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Circle<Sphere<J>>>", translate(member("get6", type(TestingUtils.Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(TestingUtils.Sphere.class))));
    }

    private String translate(final TypeMirror type) {
        return translate(new JavaType(type));
    }

    private String translate(final JavaType type) {
        return type.translate().toTypeScript();
    }

    private String translate(final TsTypeTarget tsTypeTarget, final TypeMirror type) {
        return translate(tsTypeTarget, new JavaType(type));
    }

    private String translate(final TsTypeTarget tsTypeTarget, final JavaType type) {
        return type.translate(tsTypeTarget).toTypeScript();
    }
}