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

    const mapKeys = Object.keys(output[value]);
    expect(mapKeys.length).toBe(2);

    const key1Str = mapKeys[0];
    const key2Str = mapKeys[1];

    mapKeys.forEach(k => {
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
      new Map([[new MyPojo("bar11"), new MyPojo("bar12")], [new MyPojo("bar21"), new MyPojo("bar22")]])
    );

    const output = new JavaHashMapMarshaller().marshall(input, new MarshallingContext())!;

    const mapKeys = Object.keys(output[value]);
    expect(mapKeys.length).toBe(2);

    const key1Str = mapKeys[0];
    const key2Str = mapKeys[1];

    mapKeys.forEach(k => {
      expect(k.startsWith(json)).toBeTruthy();
    });

    const key1Obj = JSON.parse(key1Str.replace(json, ""));
    const key2Obj = JSON.parse(key2Str.replace(json, ""));

    expect(key1Obj).toStrictEqual({
      [encodedType]: "com.app.my.MyPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      foo: "bar11"
    });

    expect(key2Obj).toStrictEqual({
      [encodedType]: "com.app.my.MyPojo",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      foo: "bar21"
    });

    expect(output).toStrictEqual({
      [encodedType]: "java.util.HashMap",
      [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [value]: {
        [key1Str]: {
          [encodedType]: "com.app.my.MyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "bar12"
        },
        [key2Str]: {
          [encodedType]: "com.app.my.MyPojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          foo: "bar22"
        }
      }
    });
  });

  test("with custom pojo containing cached key, should reuse it and don't repeat data", () => {});
  test("with map containing repeated value, should reuse it and don't repeat data", () => {});
  test("with root null object, should serialize to null", () => {});
  test("with root undefined object, should serialize to null", () => {});

  class MyPojo implements Portable<MyPojo> {
    private readonly _fqcn = "com.app.my.MyPojo";

    public readonly foo: string;

    constructor(foo: string) {
      this.foo = foo;
    }
  }
});
