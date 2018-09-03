import JavaIntegerMarshaller from "appformer/marshalling/marshallers/JavaIntegerMarshaller";
import JavaLongMarshaller from "appformer/marshalling/marshallers/JavaLongMarshaller";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaByte from "appformer/java-wrapper/JavaByte";
import JavaDouble from "appformer/java-wrapper/JavaDouble";
import JavaFloat from "appformer/java-wrapper/JavaFloat";
import JavaInteger from "appformer/java-wrapper/JavaInteger";
import JavaLong from "appformer/java-wrapper/JavaLong";
import JavaShort from "appformer/java-wrapper/JavaShort";
import JavaBigDecimal from "appformer/java-wrapper/JavaBigDecimal";
import JavaBigInteger from "appformer/java-wrapper/JavaBigInteger";
import JavaWrapper from "appformer/java-wrapper/JavaWrapper";
import JavaArrayList from "appformer/java-wrapper/JavaArrayList";
import JavaHashSet from "appformer/java-wrapper/JavaHashSet";
import JavaHashMap from "appformer/java-wrapper/JavaHashMap";
import JavaBoolean from "appformer/java-wrapper/JavaBoolean";
import JavaString from "appformer/java-wrapper/JavaString";
import JavaByteMarshaller from "appformer/marshalling/marshallers/JavaByteMarshaller";
import JavaDoubleMarshaller from "appformer/marshalling/marshallers/JavaDoubleMarshaller";
import JavaFloatMarshaller from "appformer/marshalling/marshallers/JavaFloatMarshaller";
import JavaShortMarshaller from "appformer/marshalling/marshallers/JavaShortMarshaller";
import JavaBooleanMarshaller from "appformer/marshalling/marshallers/JavaBooleanMarshaller";
import JavaStringMarshaller from "appformer/marshalling/marshallers/JavaStringMarshaller";
import JavaBigDecimalMarshaller from "appformer/marshalling/marshallers/JavaBigDecimalMarshaller";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import JavaArrayListMarshaller from "appformer/marshalling/marshallers/JavaArrayListMarshaller";
import JavaHashMapMarshaller from "appformer/marshalling/marshallers/JavaHashMapMarshaller";
import JavaHashSetMarshaller from "appformer/marshalling/marshallers/JavaHashSetMarshaller";
import Portable from "appformer/internal/model/Portable";
import { marshall } from "appformer/marshalling";
import DefaultMarshaller from "appformer/marshalling/marshallers/DefaultMarshaller";

describe("marshall", () => {
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const numVal = ErraiObjectConstants.NUM_VAL;
  const value = ErraiObjectConstants.VALUE;

  let noAddrPerson: Person;
  let addr1: Address;

  beforeEach(() => {
    MarshallerProvider.initialize();

    addr1 = new Address({
      line1: "aaaa",
      line2: "bbbb"
    });

    noAddrPerson = new Person({
      name: "bar"
    });
  });

  test("keep original input fields after conversion, including control fields", () => {
    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      bestFriend: noAddrPerson
    });

    const output = JSON.parse(marshall(input));

    expect(output).toStrictEqual({
      [encodedType]: "org.appformer-js.test.Person",
      [objectId]: expect.anything(),
      name: "foo",
      homeAddr: {
        [encodedType]: "org.appformer-js.test.Address",
        [objectId]: expect.anything(),
        line1: "aaaa",
        line2: "bbbb"
      },
      bestFriend: {
        [encodedType]: "org.appformer-js.test.Person",
        [objectId]: expect.anything(),
        name: "bar"
      }
    });
  });

  test("assign an objectId only for non-primitive types and use different objectIds for different objects", () => {
    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      bestFriend: noAddrPerson
    });

    // === test
    const output = JSON.parse(marshall(input));

    // === assertion
    const nonPrimitiveTypesObjId = [output[objectId], output.homeAddr[objectId], output.bestFriend[objectId]];

    const allObjIds = [
      output.name[objectId],
      output.homeAddr.line1[objectId],
      output.homeAddr.line2[objectId],
      output.bestFriend.name[objectId],
      ...nonPrimitiveTypesObjId
    ];

    const definedObjIds = allObjIds.filter(t => t !== undefined);

    // === only the non-primitive types should have an id and it should be unique
    expect(definedObjIds).toStrictEqual(nonPrimitiveTypesObjId);
    expect(Array.from(new Set(definedObjIds))).toStrictEqual(definedObjIds);
  });

  test("reuse the same objectId when objects are equals", () => {
    const anotherLine1 = addr1.line1 + "a"; // ensure different obj
    const anotherAddr = new Address({ line1: anotherLine1, line2: "fdgfg" });

    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      workAddr: addr1, // same Address object
      bestFriend: new Person({
        name: "ypjomh",
        homeAddr: anotherAddr // different Address object
      })
    });

    // == test

    const output = JSON.parse(marshall(input));

    // == assertion

    // objectId of the objects that weren't shared
    const uniqueObjIds = [output[objectId], output.bestFriend[objectId], output.bestFriend.homeAddr[objectId]];

    const fooHomeAddrObjId = output.homeAddr[objectId];
    const fooWorkAddrObjId = output.workAddr[objectId];

    expect(fooHomeAddrObjId).toEqual(fooWorkAddrObjId); // same object, then same objId
    expect(uniqueObjIds).not.toContain(fooHomeAddrObjId); // different than any other objId

    // when reusing an existent object, do not include the data fields to optimize the output size
    expect(output.workAddr.line1).toBeUndefined();
    expect(output.workAddr.line2).toBeUndefined();
  });

  test("pojo", () => {
    const pojo = new Pojo({
      line1: "addr1",
      line2: "addr2",
      n1: new JavaByte("1"),
      n2: new JavaDouble("2"),
      n3: new JavaFloat("3"),
      n4: new JavaInteger("4"),
      n5: new JavaLong("5"),
      n6: new JavaShort("6"),
      n7: new JavaBigDecimal("7"),
      n8: new JavaBigInteger("8")
    });

    const output = JSON.parse(marshall(pojo));
    expect(output).toStrictEqual({
      [encodedType]: "org.appformer-js.test.Pojo",
      [objectId]: expect.anything(),
      line1: "addr1",
      line2: "addr2",
      n1: 1,
      n2: 2,
      n3: 3,
      n4: 4,
      n5: {
        [encodedType]: "java.lang.Long",
        [objectId]: "-1",
        "^NumVal": "5"
      },
      n6: 6,
      n7: {
        [encodedType]: "java.math.BigDecimal",
        [objectId]: "-1",
        "^Value": "7"
      },
      n8: {
        [encodedType]: "java.math.BigInteger",
        [objectId]: "-1",
        "^Value": "8"
      }
    });
  });

  test("instanceof", () => {
    const array = [1, 2, 3];
    expect(JavaWrapper.wrapIfNeeded(new Array(1, 2, 3))).toEqual(new JavaArrayList(array));
    expect(JavaWrapper.wrapIfNeeded(array)).toEqual(new JavaArrayList(array));

    const set = new Set(array);
    expect(JavaWrapper.wrapIfNeeded(set)).toEqual(new JavaHashSet(set));

    const map = new Map([[1, "1"], [2, "2"], [3, "3"]]);
    expect(JavaWrapper.wrapIfNeeded(map)).toEqual(new JavaHashMap(map));

    const bool = true;
    expect(JavaWrapper.wrapIfNeeded(Boolean(bool))).toEqual(new JavaBoolean(bool));
    expect(JavaWrapper.wrapIfNeeded(bool)).toEqual(new JavaBoolean(bool));

    const str = "str";
    expect(JavaWrapper.wrapIfNeeded(String(str))).toEqual(new JavaString(str));
    expect(JavaWrapper.wrapIfNeeded(str)).toEqual(new JavaString(str));

    const anything = new Address({ line1: "", line2: "" });
    expect(JavaWrapper.wrapIfNeeded(anything)).toBeUndefined();
  });

  test("wrap", () => {
    MarshallerProvider.initialize();
    expect(JavaWrapper.isJavaType("java.lang.Byte")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Double")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Float")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Integer")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Long")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Short")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.Boolean")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.lang.String")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.math.BigDecimal")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.math.BigInteger")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.util.ArrayList")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.util.HashSet")).toBeTruthy();
    expect(JavaWrapper.isJavaType("java.util.HashMap")).toBeTruthy();

    expect(JavaWrapper.isJavaType("foo")).toBeFalsy();
  });

  test("getFor", () => {
    MarshallerProvider.initialize();
    expect(MarshallerProvider.getFor(new JavaByte("1"))).toEqual(new JavaByteMarshaller());
    expect(MarshallerProvider.getFor(new JavaDouble("1.2"))).toEqual(new JavaDoubleMarshaller());
    expect(MarshallerProvider.getFor(new JavaFloat("1.1"))).toEqual(new JavaFloatMarshaller());
    expect(MarshallerProvider.getFor(new JavaInteger("1"))).toEqual(new JavaIntegerMarshaller());
    expect(MarshallerProvider.getFor(new JavaLong("1"))).toEqual(new JavaLongMarshaller());
    expect(MarshallerProvider.getFor(new JavaShort("1"))).toEqual(new JavaShortMarshaller());
    expect(MarshallerProvider.getFor(new JavaBoolean(true))).toEqual(new JavaBooleanMarshaller());
    expect(MarshallerProvider.getFor(new JavaString("str"))).toEqual(new JavaStringMarshaller());
    expect(MarshallerProvider.getFor(new JavaBigDecimal("1.1"))).toEqual(new JavaBigDecimalMarshaller());
    expect(MarshallerProvider.getFor(new JavaBigInteger("1"))).toEqual(new JavaBigIntegerMarshaller());
    expect(MarshallerProvider.getFor(new JavaArrayList([1, 2, 3]))).toEqual(new JavaArrayListMarshaller());
    expect(MarshallerProvider.getFor(new JavaHashSet(new Set([1, 2, 3])))).toEqual(new JavaHashSetMarshaller());
    expect(MarshallerProvider.getFor(new JavaHashMap(new Map([["foo", "bar"]])))).toEqual(new JavaHashMapMarshaller());

    expect(MarshallerProvider.getFor(new NonPortable("bar"))).toEqual(new DefaultMarshaller()); // no fqcn
    expect(MarshallerProvider.getFor(new Address({ line1: "l1", line2: "l2" }))).toEqual(new DefaultMarshaller()); // custom fqcn

    // TODO how to test a java type without marshaller?
  });

  test("list serialization", () => {
    const input = new Pojo({
      l1: [new JavaByte("1"), new JavaByte("2"), new JavaByte("3"), new JavaByte("4")],
      l2: [new JavaDouble("1.1"), new JavaDouble("2.2"), new JavaDouble("3.3"), new JavaDouble("4.4")],
      l3: [new JavaFloat("1.1"), new JavaFloat("2.2"), new JavaFloat("3.3"), new JavaFloat("4.4")],
      l4: [new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3"), new JavaInteger("4")],
      l5: [new JavaLong("1"), new JavaLong("2"), new JavaLong("3"), new JavaLong("4")],
      l6: [new JavaShort("1"), new JavaShort("2"), new JavaShort("3"), new JavaShort("4")],
      l7: [new JavaBigDecimal("1.1"), new JavaBigDecimal("2.2"), new JavaBigDecimal("3.3"), new JavaBigDecimal("4.4")],
      l8: [new JavaBigInteger("1"), new JavaBigInteger("2"), new JavaBigInteger("3"), new JavaBigInteger("4")],
      l9: ["str1", "str2", "str3"]
    });

    const output = JSON.parse(marshall(input));

    const a = 2; // TODO assertion
  });

  test("set serialization", () => {
    const input = new Pojo({
      s1: new Set([new JavaByte("1"), new JavaByte("2"), new JavaByte("3"), new JavaByte("4")]),
      s2: new Set([new JavaDouble("1.1"), new JavaDouble("2.2"), new JavaDouble("3.3"), new JavaDouble("4.4")]),
      s3: new Set([new JavaFloat("1.1"), new JavaFloat("2.2"), new JavaFloat("3.3"), new JavaFloat("4.4")]),
      s4: new Set([new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3"), new JavaInteger("4")]),
      s5: new Set([new JavaLong("1"), new JavaLong("2"), new JavaLong("3"), new JavaLong("4")]),
      s6: new Set([new JavaShort("1"), new JavaShort("2"), new JavaShort("3"), new JavaShort("4")]),
      s7: new Set([
        new JavaBigDecimal("1.1"),
        new JavaBigDecimal("2.2"),
        new JavaBigDecimal("3.3"),
        new JavaBigDecimal("4.4")
      ]),
      s8: new Set([new JavaBigInteger("1"), new JavaBigInteger("2"), new JavaBigInteger("3"), new JavaBigInteger("4")]),
      s9: new Set(["str1", "str2", "str3"])
    });

    const output = JSON.parse(marshall(input));

    const a = 2; // TODO assertion
  });

  test("root string", () => {
    const input = "hey";

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input);
  });

  test("root byte", () => {
    const input = new JavaByte("1");

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input.get());
  });

  test("root double", () => {
    const input = new JavaDouble("1.1");

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input.get());
  });

  test("root float", () => {
    const input = new JavaFloat("1.1");

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input.get());
  });

  test("root integer", () => {
    const input = new JavaInteger("1");

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input.get());
  });

  test("root long", () => {
    const input = new JavaLong("1");

    const output = JSON.parse(marshall(input));

    expect(output).toEqual({
      [encodedType]: "java.lang.Long",
      [objectId]: "-1",
      [numVal]: "1"
    });
  });

  test("root short", () => {
    const input = new JavaShort("1");

    const output = JSON.parse(marshall(input));

    expect(output).toBe(input.get());
  });

  test("root BigDecimal", () => {
    const input = new JavaBigDecimal("1.1");

    const output = JSON.parse(marshall(input));

    expect(output).toEqual({
      [encodedType]: "java.math.BigDecimal",
      [objectId]: "-1",
      [value]: "1.1"
    });
  });

  test("root BigInteger", () => {
    const input = new JavaBigInteger("1");

    const output = JSON.parse(marshall(input));

    expect(output).toEqual({
      [encodedType]: "java.math.BigInteger",
      [objectId]: "-1",
      [value]: "1"
    });
  });

  test("root array", () => {
    const input = [new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3")];

    const output = JSON.parse(marshall(input));

    expect(output).toEqual({
      [encodedType]: "java.util.ArrayList",
      [objectId]: expect.anything(),
      [value]: [
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 1
        },
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 2
        },
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 3
        }
      ]
    });
  });

  test("root set", () => {
    const input = new Set([new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3")]);

    const output = JSON.parse(marshall(input));

    expect(output).toEqual({
      [encodedType]: "java.util.HashSet",
      [objectId]: expect.anything(),
      [value]: [
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 1
        },
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 2
        },
        {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 3
        }
      ]
    });
  });
});

// ==============
// ==============
// ============== fixture classes

class Person implements Portable<Person> {
  protected readonly _fqcn = "org.appformer-js.test.Person";

  public name: string;
  public homeAddr?: Address;
  public workAddr?: Address;
  public bestFriend?: Person;

  constructor(self: { name: string; homeAddr?: Address; workAddr?: Address; bestFriend?: Person }) {
    Object.assign(this, self);
  }
}

class Address implements Portable<Address> {
  protected readonly _fqcn = "org.appformer-js.test.Address";

  public line1: string;
  public line2: string;

  constructor(self: { line1: string; line2: string }) {
    Object.assign(this, self);
  }
}

class Pojo implements Portable<Pojo> {
  protected readonly _fqcn = "org.appformer-js.test.Pojo";

  public line1?: string;
  public line2?: string;
  public n1?: JavaByte;
  public n2?: JavaDouble;
  public n3?: JavaFloat;
  public n4?: JavaInteger;
  public n5?: JavaLong;
  public n6?: JavaShort;
  public n7?: JavaBigDecimal;
  public n8?: JavaBigInteger;
  public l1?: number[];

  constructor(self: {
    line1?: string;
    line2?: string;
    n1?: JavaByte;
    n2?: JavaDouble;
    n3?: JavaFloat;
    n4?: JavaInteger;
    n5?: JavaLong;
    n6?: JavaShort;
    n7?: JavaBigDecimal;
    n8?: JavaBigInteger;

    l1?: JavaByte[];
    l2?: JavaDouble[];
    l3?: JavaFloat[];
    l4?: JavaInteger[];
    l5?: JavaLong[];
    l6?: JavaShort[];
    l7?: JavaBigDecimal[];
    l8?: JavaBigInteger[];
    l9?: string[];

    s1?: Set<JavaByte>;
    s2?: Set<JavaDouble>;
    s3?: Set<JavaFloat>;
    s4?: Set<JavaInteger>;
    s5?: Set<JavaLong>;
    s6?: Set<JavaShort>;
    s7?: Set<JavaBigDecimal>;
    s8?: Set<JavaBigInteger>;
    s9?: Set<string>;
  }) {
    Object.assign(this, self);
  }
}

class NonPortable {
  private readonly _foo: string;

  constructor(foo: string) {
    this._foo = foo;
  }

  public foo(): string {
    return this._foo;
  }
}
