import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import JavaHashMapMarshaller from "appformer/marshalling/marshallers/JavaHashMapMarshaller";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import TestUtils from "__tests__/util/TestUtils";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import Portable from "appformer/internal/model/Portable";
import DefaultMarshaller from "appformer/marshalling/marshallers/DefaultMarshaller";

describe("marshall", () => {
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const value = ErraiObjectConstants.VALUE;
  const numVal = ErraiObjectConstants.NUM_VAL;
  const json = ErraiObjectConstants.JSON;

  beforeEach(() => {
    MarshallerProvider.initialize();
  });

  test("with empty map, should serialize normally", () => {
    const input = new JavaHashMap(new Map());

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {}
    });
  });

  test("with string key and value, should serialize normally", () => {
    const input = new JavaHashMap(new Map([["foo1", "bar1"], ["foo2", "bar2"]]));

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        foo1: "bar1",
        foo2: "bar2"
      }
    });
  });

  test("with JavaNumber key and value, should wrap key and value into an errai object", () => {
    const input = new JavaHashMap(
      new Map([[new JavaInteger("11"), new JavaInteger("12")], [new JavaInteger("21"), new JavaInteger("22")]])
    );

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());

    const expectedKey1 = `${json +
      JSON.stringify({
        [encodedType]: "java.lang.Integer",
        [objectId]: "-1",
        [numVal]: 11
      })}`;

    const expectedKey2 = `${json +
      JSON.stringify({
        [encodedType]: "java.lang.Integer",
        [objectId]: "-1",
        [numVal]: 21
      })}`;

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [expectedKey1]: {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 12
        },
        [expectedKey2]: {
          [encodedType]: "java.lang.Integer",
          [objectId]: "-1",
          [numVal]: 22
        }
      }
    });
  });

  test("with JavaBoolean key and value, should wrap key and value into an errai object", () => {
    const input = new JavaHashMap(
      new Map([[new JavaBoolean(true), new JavaBoolean(false)], [new JavaBoolean(false), new JavaBoolean(true)]])
    );

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());

    const expectedKey1 = `${json +
      JSON.stringify({
        [encodedType]: "java.lang.Boolean",
        [objectId]: "-1",
        [numVal]: true
      })}`;

    const expectedKey2 = `${json +
      JSON.stringify({
        [encodedType]: "java.lang.Boolean",
        [objectId]: "-1",
        [numVal]: false
      })}`;

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [expectedKey1]: {
          [encodedType]: "java.lang.Boolean",
          [objectId]: "-1",
          [numVal]: false
        },
        [expectedKey2]: {
          [encodedType]: "java.lang.Boolean",
          [objectId]: "-1",
          [numVal]: true
        }
      }
    });
  });

  test("with JavaBigNumber key and value, should wrap key and value into an errai object", () => {
    const input = new JavaHashMap(
      new Map([
        [new JavaBigInteger("11"), new JavaBigInteger("12")],
        [new JavaBigInteger("21"), new JavaBigInteger("22")]
      ])
    );

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext())!;

    // need to assert the keys individually because since it's a string, can't use the regex matcher in the object id :/

    const mapKeys = Object.keys(output[value]);
    expect(mapKeys.length).toBe(2);

    const key1Str = mapKeys[0];
    const key2Str = mapKeys[1];

    mapKeys.forEach(k => {
      // complex objects as map key uses a prefix to indicate that a json must be parsed in the map key
      expect(k.startsWith(json)).toBeTruthy();
    });

    const key1Obj = JSON.parse(key1Str.replace(json, ""));
    const key2Obj = JSON.parse(key2Str.replace(json, ""));

    expect(key1Obj).toStrictEqual({
      [encodedType]: "java.math.BigInteger",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: "11"
    });

    expect(key2Obj).toStrictEqual({
      [encodedType]: "java.math.BigInteger",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: "21"
    });

    // assert map values

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [key1Str]: {
          [encodedType]: "java.math.BigInteger",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: "12"
        },
        [key2Str]: {
          [encodedType]: "java.math.BigInteger",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: "22"
        }
      }
    });
  });

  test("with custom object key and value, should wrap key and value into an errai object", () => {
    const input = new JavaHashMap(
      new Map([[new DummyPojo("bar11"), new DummyPojo("bar12")], [new DummyPojo("bar21"), new DummyPojo("bar22")]])
    );

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext())!;

    // need to assert the keys individually because since it's a string, can't use the regex matcher in the object id :/

    const mapKeys = Object.keys(output[value]);
    expect(mapKeys.length).toBe(2);

    const key1Str = mapKeys[0];
    const key2Str = mapKeys[1];

    mapKeys.forEach(k => {
      // complex objects as map key uses a prefix to indicate that a json must be parsed in the map key
      expect(k.startsWith(json)).toBeTruthy();
    });

    const key1Obj = JSON.parse(key1Str.replace(json, ""));
    const key2Obj = JSON.parse(key2Str.replace(json, ""));

    expect(key1Obj).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      foo: "bar11"
    });

    expect(key2Obj).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      foo: "bar21"
    });

    // assert map values

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [key1Str]: {
          [encodedType]: "com.app.my.DummyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "bar12"
        },
        [key2Str]: {
          [encodedType]: "com.app.my.DummyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "bar22"
        }
      }
    });
  });

  test("with custom pojo containing cached key, should reuse it and don't repeat data", () => {
    const repeatedPojo = new DummyPojo("repeatedKey");

    const input = {
      _fqcn: "com.app.my.ComplexPojo",
      dummy: repeatedPojo,
      map: new JavaHashMap(new Map([[repeatedPojo, "value1"], [new DummyPojo("uniqueKey"), "value2"]]))
    };

    const context = new MarshallingContext();
    const output = new DefaultMarshaller().marshall(input, context)!;

    // ===== assertions

    // 1) Assert map content

    const mapOutput = (output as any).map;
    const mapKeys = Object.keys(mapOutput[value]);
    expect(mapKeys.length).toBe(2);

    const key1Str = mapKeys[0];
    const key2Str = mapKeys[1];

    mapKeys.forEach(k => {
      // complex objects as map key uses a prefix to indicate that a json must be parsed in the map key
      expect(k.startsWith(json)).toBeTruthy();
    });

    const key1Obj = JSON.parse(key1Str.replace(json, ""));
    const key2Obj = JSON.parse(key2Str.replace(json, ""));

    // assert keys contents

    const key1ObjectId = key1Obj[objectId]; // this is the cached object's id
    expect(key1ObjectId).toMatch(TestUtils.positiveNumberRegex);
    expect(key1Obj).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: key1ObjectId // without object's content
    });

    expect(key2Obj).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      foo: "uniqueKey"
    });

    // assert map values contents

    expect(mapOutput).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [key1Str]: "value1",
        [key2Str]: "value2"
      }
    });

    // 2) Assert full object content

    expect(output).toStrictEqual({
      [encodedType]: "com.app.my.ComplexPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      dummy: {
        [encodedType]: "com.app.my.DummyPojo",
        [objectId]: key1ObjectId, // same object id than the one used as map key
        foo: "repeatedKey"
      },
      map: mapOutput // already asserted
    });

    // do not cache repeated object's data
    expect(context.getCached(repeatedPojo)).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: key1ObjectId
    });
  });

  test("with map containing repeated value, should reuse it and don't repeat data", () => {
    const repeatedValue = new DummyPojo("repeatedValue");
    const uniqueValue = new DummyPojo("uniqueValue");

    const input = new JavaHashMap(new Map([["key1", repeatedValue], ["key2", repeatedValue], ["key3", uniqueValue]]));

    const context = new MarshallingContext();
    const output = new JavaHashMapMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        key1: {
          [encodedType]: "com.app.my.DummyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "repeatedValue"
        },
        key2: {
          [encodedType]: "com.app.my.DummyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex)
          // missing data
        },
        key3: {
          [encodedType]: "com.app.my.DummyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "uniqueValue"
        }
      }
    });

    // same object id
    const repeatedObjIdFirstAppearance = (output as any)[value].key1[objectId];
    const repeatedObjIdSecondAppearance = (output as any)[value].key2[objectId];
    expect(repeatedObjIdFirstAppearance).toEqual(repeatedObjIdSecondAppearance);

    // do not cache repeated object's data
    expect(context.getCached(repeatedValue)).toStrictEqual({
      [encodedType]: "com.app.my.DummyPojo",
      [objectId]: repeatedObjIdFirstAppearance
    });
  });

  test("with root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());
    expect(output).toBeNull();
  });

  test("with root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext());
    expect(output).toBeNull();
  });

  class DummyPojo implements Portable<DummyPojo> {
    private readonly _fqcn = "com.app.my.DummyPojo";

    public readonly foo: string;

    constructor(foo: string) {
      this.foo = foo;
    }
  }
});
