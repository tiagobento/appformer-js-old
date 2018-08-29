import { Portable } from "appformer/remote/";
import * as Marshalling from "appformer/remote/Marshalling";
import { ErraiObjectConstants } from "appformer/remote/model/ErraiObject";
import { JavaLong } from "../../../appformer/internal/model/numbers/JavaLong";
import { JavaInteger } from "../../../appformer/internal/model/numbers/JavaInteger";
import { JavaBigDecimal } from "../../../appformer/internal/model/numbers/JavaBigDecimal";
import { JavaByte } from "../../../appformer/internal/model/numbers/JavaByte";
import { JavaDouble } from "../../../appformer/internal/model/numbers/JavaDouble";
import { JavaFloat } from "../../../appformer/internal/model/numbers/JavaFloat";
import { JavaShort } from "../../../appformer/internal/model/numbers/JavaShort";
import { JavaBigInteger } from "../../../appformer/internal/model/numbers/JavaBigInteger";
import { JavaWrapper } from "../../../appformer/internal/model/numbers/JavaWrapper";
import { JavaArrayList } from "../../../appformer/internal/model/numbers/JavaArrayList";
import { JavaHashSet } from "../../../appformer/internal/model/numbers/JavaHashSet";
import { JavaHashMap } from "../../../appformer/internal/model/numbers/JavaHashMap";
import { JavaBoolean } from "../../../appformer/internal/model/numbers/JavaBoolean";
import { JavaString } from "../../../appformer/internal/model/numbers/JavaString";
import { MarshallerProvider } from "../../../appformer/remote/ErraiMarshaller";
import JavaHashMapMarshaller from "../../../appformer/remote/JavaHashMapMarshaller";
import JavaHashSetMarshaller from "../../../appformer/remote/JavaHashSetMarshaller";
import JavaArrayListMarshaller from "../../../appformer/remote/JavaArrayListMarshaller";
import JavaBigIntegerMarshaller from "../../../appformer/remote/JavaBigIntegerMarshaller";
import JavaBigDecimalMarshaller from "../../../appformer/remote/JavaBigDecimalMarshaller";
import JavaStringMarshaller from "../../../appformer/remote/JavaStringMarshaller";
import JavaBooleanMarshaller from "../../../appformer/remote/JavaBooleanMarshaller";
import JavaShortMarshaller from "../../../appformer/remote/JavaShortMarshaller";
import JavaLongMarshaller from "../../../appformer/remote/JavaLongMarshaller";
import JavaIntegerMarshaller from "../../../appformer/remote/JavaIntegerMarshaller";
import JavaFloatMarshaller from "../../../appformer/remote/JavaFloatMarshaller";
import JavaDoubleMarshaller from "../../../appformer/remote/JavaDoubleMarshaller";
import JavaByteMarshaller from "../../../appformer/remote/JavaByteMarshaller";

describe("marshall", () => {
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const objectId = ErraiObjectConstants.OBJECT_ID;

  let noAddrPerson: Person;
  let addr1: Address;

  beforeEach(() => {
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

    const output = JSON.parse(Marshalling.marshall(input));

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
    const output = JSON.parse(Marshalling.marshall(input));

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

    const output = JSON.parse(Marshalling.marshall(input));

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

    const output = JSON.parse(Marshalling.marshall(pojo));
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
    expect(MarshallerProvider.getFor("java.lang.Byte")).toEqual(new JavaByteMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Double")).toEqual(new JavaDoubleMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Float")).toEqual(new JavaFloatMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Integer")).toEqual(new JavaIntegerMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Long")).toEqual(new JavaLongMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Short")).toEqual(new JavaShortMarshaller());
    expect(MarshallerProvider.getFor("java.lang.Boolean")).toEqual(new JavaBooleanMarshaller());
    expect(MarshallerProvider.getFor("java.lang.String")).toEqual(new JavaStringMarshaller());
    expect(MarshallerProvider.getFor("java.math.BigDecimal")).toEqual(new JavaBigDecimalMarshaller());
    expect(MarshallerProvider.getFor("java.math.BigInteger")).toEqual(new JavaBigIntegerMarshaller());
    expect(MarshallerProvider.getFor("java.util.ArrayList")).toEqual(new JavaArrayListMarshaller());
    expect(MarshallerProvider.getFor("java.util.HashSet")).toEqual(new JavaHashSetMarshaller());
    expect(MarshallerProvider.getFor("java.util.HashMap")).toEqual(new JavaHashMapMarshaller());

    expect(() => MarshallerProvider.getFor("foo")).toThrowError(Error);
  });
});

// ==============
// ==============
// ============== fixture classes

class Person implements Portable {
  protected readonly _fqcn = "org.appformer-js.test.Person";

  public name: string;
  public homeAddr?: Address;
  public workAddr?: Address;
  public bestFriend?: Person;

  constructor(self: { name: string; homeAddr?: Address; workAddr?: Address; bestFriend?: Person }) {
    Object.assign(this, self);
  }
}

class Address implements Portable {
  protected readonly _fqcn = "org.appformer-js.test.Address";

  public line1: string;
  public line2: string;

  constructor(self: { line1: string; line2: string }) {
    Object.assign(this, self);
  }
}

class Pojo implements Portable {
  protected readonly _fqcn = "org.appformer-js.test.Pojo";

  public line1: string;
  public line2: string;
  public n1: JavaByte;
  public n2: JavaDouble;
  public n3: JavaFloat;
  public n4: JavaInteger;
  public n5: JavaLong;
  public n6: JavaShort;
  public n7: JavaBigDecimal;
  public n8: JavaBigInteger;

  constructor(self: {
    line1: string;
    line2: string;
    n1: JavaByte;
    n2: JavaDouble;
    n3: JavaFloat;
    n4: JavaInteger;
    n5: JavaLong;
    n6: JavaShort;
    n7: JavaBigDecimal;
    n8: JavaBigInteger;
  }) {
    Object.assign(this, self);
  }
}
