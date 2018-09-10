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
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorDependency;
import org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore;
import org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget;

import static java.util.Collections.singleton;
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
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_DECLARATION;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_IMPORT;
import static org.uberfire.jsbridge.tsexporter.meta.JavaType.TsTypeTarget.TYPE_ARGUMENT_USE;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.Circle;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.Cylinder;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.DeclaredTypes;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.Foo;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.Sphere;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.array;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.erased;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.member;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.param;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.primitive;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.types;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.wildcard;

public class JavaTypeTest {

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

    @Test
    public void testPrimitives() {
        assertEquals("JavaInteger", translate(primitive(INT)));
        assertEquals("JavaByte", translate(primitive(BYTE)));
        assertEquals("JavaDouble", translate(primitive(DOUBLE)));
        assertEquals("JavaFloat", translate(primitive(FLOAT)));
        assertEquals("JavaShort", translate(primitive(SHORT)));
        assertEquals("JavaLong", translate(primitive(LONG)));
        assertEquals("void", translate(types.getNoType(VOID)));
        assertEquals("string", translate(primitive(CHAR)));
        assertEquals("boolean", translate(primitive(BOOLEAN)));
        assertEquals("null", translate(types.getNullType()));
    }

    @Test
    public void testArray() {
        assertEquals("JavaInteger[]", translate(array(primitive(INT))));
        assertEquals("JavaInteger[][]", translate(array(array(primitive(INT)))));
        assertEquals("string[]", translate(array(type(String.class))));
        assertEquals("Map<any, any>[]", translate(array(erased(type(Map.class)))));
        assertEquals("E[][]", translate(array(type(List.class))));
        assertEquals("any[][]", translate(array(erased(type(List.class)))));
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

    @Test
    public void testDecorated() {
        final DecoratorDependency dependency = new DecoratorDependency(
                "my-decorators",
                "my-decorators/decorators/Bar",
                Foo.class.getCanonicalName());

        final JavaType.Translatable translatable = new JavaType(type(Foo.class), type(Foo.class))
                .translate(TYPE_ARGUMENT_DECLARATION, new DecoratorStore(singleton(dependency)));

        assertEquals("mydecorators_decorators_Bar", translatable.toTypeScript());
        assertEquals(1, translatable.getAggregated().size());
        assertEquals(dependency, translatable.getAggregated().get(0));
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
        assertEquals("JavaInteger", translate(type(Integer.class)));
        assertEquals("JavaByte", translate(type(Byte.class)));
        assertEquals("JavaDouble", translate(type(Double.class)));
        assertEquals("JavaFloat", translate(type(Float.class)));
        assertEquals("JavaLong", translate(type(Long.class)));
        assertEquals("JavaNumber", translate(type(Number.class)));
        assertEquals("JavaShort", translate(type(Short.class)));
        assertEquals("JavaBigInteger", translate(type(BigInteger.class)));
        assertEquals("JavaBigDecimal", translate(type(BigDecimal.class)));
        assertEquals("number", translate(type(OptionalInt.class)));
        assertEquals("any /* class */", translate(type(Class.class)));
        assertEquals("any /* enum_ */", translate(type(Enum.class)));
        assertEquals("any /* map entry */", translate(type(Map.Entry.class)));
        //TODO: HashMap.Node: It's protected! How?
        assertEquals("JavaTreeMap<any, any>", translate(erased(type(TreeMap.class))));
        assertEquals("Map<any, any>", translate(erased(type(HashMap.class))));
        assertEquals("Map<any, any>", translate(erased(type(Map.class))));
        assertEquals("Set<any>", translate(erased(type(Set.class))));
        assertEquals("Set<any>", translate(erased(type(HashSet.class))));
        assertEquals("JavaTreeSet<any>", translate(erased(type(TreeSet.class))));
        assertEquals("any[]", translate(erased(type(List.class))));
        assertEquals("any[]", translate(erased(type(ArrayList.class))));
        assertEquals("JavaLinkedList<any>", translate(erased(type(LinkedList.class))));
        assertEquals("any[]", translate(erased(type(Collection.class))));
        assertEquals("any[]", translate(TYPE_ARGUMENT_IMPORT, erased(type(Collection.class))));
        assertEquals("Foo", translate(type(Foo.class)));
        assertEquals("Foo", translate(TYPE_ARGUMENT_IMPORT, type(Foo.class)));
        assertEquals("Bar", translate(type(Foo.Bar.class)));
        assertEquals("Bar", translate(TYPE_ARGUMENT_IMPORT, type(Foo.Bar.class)));
        assertEquals("Circle<any>", translate(erased(type(Circle.class))));
        assertEquals("Circle", translate(TYPE_ARGUMENT_IMPORT, erased(type(Circle.class))));
        assertEquals("JavaOptional<any>", translate(erased(type(Optional.class))));

        assertEquals("Map<string, string>", translate(member("map", type(DeclaredTypes.class))));
        assertEquals("JavaTreeMap<string, string>", translate(member("treeMap", type(DeclaredTypes.class))));
        assertEquals("Set<string>", translate(member("set", type(DeclaredTypes.class))));
        assertEquals("Set<string>", translate(member("hashSet", type(DeclaredTypes.class))));
        assertEquals("JavaTreeSet<string>", translate(member("treeSet", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("list", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("arrayList", type(DeclaredTypes.class))));
        assertEquals("JavaLinkedList<string>", translate(member("linkedList", type(DeclaredTypes.class))));
        assertEquals("string[]", translate(member("collection", type(DeclaredTypes.class))));
        assertEquals("any /* class */", translate(member("clazz", type(DeclaredTypes.class))));
        assertEquals("JavaOptional<string>", translate(member("optional", type(DeclaredTypes.class))));
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
        assertEquals("", translate(TYPE_ARGUMENT_IMPORT, member("get1", type(Circle.class))));
        assertEquals("<U>", translate(member("get2", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get2", type(Circle.class))));
        assertEquals("<U extends T>", translate(member("get3", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Circle.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get3", type(Circle.class))));
        assertEquals("<U extends T, S extends U>", translate(member("get4", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get4", type(Circle.class))));
        assertEquals("<U extends T, S extends T[]>", translate(member("get5", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get5", type(Circle.class))));
        assertEquals("<U extends T, S extends Circle<T>>", translate(member("get6", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Circle.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get6", type(Circle.class))));

        assertEquals("", translate(member("get1", type(Cylinder.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(Cylinder.class))));
        assertEquals("", translate(TYPE_ARGUMENT_IMPORT, member("get1", type(Cylinder.class))));
        assertEquals("<U>", translate(member("get2", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get2", type(Cylinder.class))));
        assertEquals("<U extends Cylinder>", translate(member("get3", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Cylinder.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get3", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends U>", translate(member("get4", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get4", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Cylinder[]>", translate(member("get5", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get5", type(Cylinder.class))));
        assertEquals("<U extends Cylinder, S extends Circle<Cylinder>>", translate(member("get6", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Cylinder.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get6", type(Cylinder.class))));

        assertEquals("", translate(member("get1", type(Sphere.class))));
        assertEquals("", translate(TYPE_ARGUMENT_USE, member("get1", type(Sphere.class))));
        assertEquals("", translate(TYPE_ARGUMENT_IMPORT, member("get1", type(Sphere.class))));
        assertEquals("<U>", translate(member("get2", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get2", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get2", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>>", translate(member("get3", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_USE, member("get3", type(Sphere.class))));
        assertEquals("<U>", translate(TYPE_ARGUMENT_IMPORT, member("get3", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends U>", translate(member("get4", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get4", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get4", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Sphere<J>[]>", translate(member("get5", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get5", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get5", type(Sphere.class))));
        assertEquals("<U extends Sphere<J>, S extends Circle<Sphere<J>>>", translate(member("get6", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_USE, member("get6", type(Sphere.class))));
        assertEquals("<U, S>", translate(TYPE_ARGUMENT_IMPORT, member("get6", type(Sphere.class))));
    }

    private String translate(final TypeMirror type) {
        return translate(new JavaType(type, type));
    }

    private String translate(final JavaType type) {
        return type.translate(TYPE_ARGUMENT_DECLARATION).toTypeScript();
    }

    private String translate(final TsTypeTarget tsTypeTarget, final TypeMirror type) {
        return translate(tsTypeTarget, new JavaType(type, type));
    }

    private String translate(final TsTypeTarget tsTypeTarget, final JavaType type) {
        return type.translate(tsTypeTarget).toTypeScript();
    }
}