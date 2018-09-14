import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import GenericsTypeMarshallingUtils from "appformer/marshalling/marshallers/util/GenericsTypeMarshallingUtils";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import {
  JavaArrayListMarshaller,
  JavaHashSetMarshaller
} from "appformer/marshalling/marshallers/JavaCollectionMarshaller";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaBigDecimal from "appformer/java-wrappers/JavaBigDecimal";
import JavaBigDecimalMarshaller from "appformer/marshalling/marshallers/JavaBigDecimalMarshaller";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import JavaHashMapMarshaller from "appformer/marshalling/marshallers/JavaHashMapMarshaller";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";
import JavaLong from "appformer/java-wrappers/JavaLong";
import JavaDate from "appformer/java-wrappers/JavaDate";
import JavaString from "appformer/java-wrappers/JavaString";
import JavaLongMarshaller from "appformer/marshalling/marshallers/JavaLongMarshaller";
import JavaStringMarshaller from "appformer/marshalling/marshallers/JavaStringMarshaller";
import JavaDateMarshaller from "appformer/marshalling/marshallers/JavaDateMarshaller";
import DefaultMarshaller from "appformer/marshalling/marshallers/DefaultMarshaller";
import Portable from "appformer/internal/model/Portable";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaOptional from "appformer/java-wrappers/JavaOptional";
import JavaOptionalMarshaller from "appformer/marshalling/marshallers/JavaOptionalMarshaller";

describe("marshallGenericsTypeElement", () => {
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const numVal = ErraiObjectConstants.NUM_VAL;

  beforeEach(() => {
    MarshallerProvider.initialize();
  });

  test("with array input, should marshall with regular marshalling", () => {
    const baseArray = ["str1", "str2"];

    const arrayInput = {
      input: baseArray,
      inputAsJavaArrayList: new JavaArrayList(baseArray)
    };

    const javaArrayListInput = {
      input: new JavaArrayList(baseArray),
      inputAsJavaArrayList: new JavaArrayList(baseArray)
    };

    [arrayInput, javaArrayListInput].forEach(({ input, inputAsJavaArrayList }) => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
      const expected = new JavaArrayListMarshaller().marshall(inputAsJavaArrayList, new MarshallingContext())!;

      // don't care about the ids
      delete output[objectId];
      delete expected[objectId];

      expect(output).toStrictEqual(expected);
    });
  });

  test("with Set input, should marshall with regular marshalling", () => {
    const baseSet = new Set(["str1", "str2"]);

    const setInput = {
      input: baseSet,
      inputAsJavaHashSet: new JavaHashSet(baseSet)
    };

    const javaHashSetInput = {
      input: new JavaHashSet(baseSet),
      inputAsJavaHashSet: new JavaHashSet(baseSet)
    };

    [setInput, javaHashSetInput].forEach(({ input, inputAsJavaHashSet }) => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
      const expected = new JavaHashSetMarshaller().marshall(inputAsJavaHashSet, new MarshallingContext())!;

      // don't care about the ids
      delete output[objectId];
      delete expected[objectId];

      expect(output).toStrictEqual(expected);
    });
  });

  test("with JavaBigDecimal input, should marshall with regular marshalling", () => {
    const input = new JavaBigDecimal("1.1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
    const expected = new JavaBigDecimalMarshaller().marshall(input, new MarshallingContext())!;

    // don't care about the ids
    delete output[objectId];
    delete expected[objectId];

    expect(output).toStrictEqual(expected);
  });

  test("with JavaBigInteger input, should marshall with regular marshalling", () => {
    const input = new JavaBigInteger("1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
    const expected = new JavaBigIntegerMarshaller().marshall(input, new MarshallingContext())!;

    // don't care about the ids
    delete output[objectId];
    delete expected[objectId];

    expect(output).toStrictEqual(expected);
  });

  test("with map input, should marshall with regular marshalling", () => {
    const baseMap = new Map([["foo1", "bar1"], ["foo2", "bar2"]]);

    const mapInput = { input: baseMap, inputAsJavaHashMap: new JavaHashMap(baseMap) };

    const javaHashMapInput = {
      input: new JavaHashMap(baseMap),
      inputAsJavaHashMap: new JavaHashMap(baseMap)
    };

    [mapInput, javaHashMapInput].forEach(({ input, inputAsJavaHashMap }) => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
      const expected = new JavaHashMapMarshaller().marshall(inputAsJavaHashMap, new MarshallingContext())!;

      // don't care about the ids
      delete output[objectId];
      delete expected[objectId];

      expect(output).toStrictEqual(expected);
    });
  });

  test("with JavaLong input, should marshall with regular marshalling", () => {
    const input = new JavaLong("1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
    const expected = new JavaLongMarshaller().marshall(input, new MarshallingContext())!;

    // don't care about the ids
    delete output[objectId];
    delete expected[objectId];

    expect(output).toStrictEqual(expected);
  });

  test("with string input, should marshall with regular marshalling", () => {
    const stringInput = {
      input: "str",
      inputAsJavaString: new JavaString("str")
    };

    const javaStringInput = {
      input: new JavaString("str"),
      inputAsJavaString: new JavaString("str")
    };

    [stringInput, javaStringInput].forEach(({ input, inputAsJavaString }) => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
      const expected = new JavaStringMarshaller().marshall(inputAsJavaString, new MarshallingContext())!;

      expect(output).toStrictEqual(expected);
    });
  });

  test("with date input, should marshall with regular marshalling", () => {
    const baseDate = new Date();

    const dateInput = {
      input: baseDate,
      inputAsJavaDate: new JavaDate(baseDate)
    };

    const javaDateInput = {
      input: new JavaDate(baseDate),
      inputAsJavaDate: new JavaDate(baseDate)
    };

    [dateInput, javaDateInput].forEach(({ input, inputAsJavaDate }) => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
      const expected = new JavaDateMarshaller().marshall(inputAsJavaDate, new MarshallingContext())!;

      // don't care about the ids
      delete output[objectId];
      delete expected[objectId];

      expect(output).toStrictEqual(expected);
    });
  });

  test("with JavaOptional input, should marshall with regular marshalling", () => {
    const input = new JavaOptional<string>("str");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
    const expected = new JavaOptionalMarshaller().marshall(input, new MarshallingContext())!;

    // don't care about the ids
    delete output[objectId];
    delete expected[objectId];

    expect(output).toStrictEqual(expected);
  });

  test("with custom portable input, should marshall with regular marshalling", () => {
    const input = new Pojo("bar");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());
    const expected = new DefaultMarshaller().marshall(input, new MarshallingContext())!;

    // don't care about the ids
    delete output[objectId];
    delete expected[objectId];

    expect(output).toStrictEqual(expected);
  });

  test("with boolean input, should return input wrapped as an ErraiObject", () => {
    const booleanInput = false;
    const javaBooleanInput = new JavaBoolean(false);

    [booleanInput, javaBooleanInput].forEach(input => {
      const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.lang.Boolean",
        [objectId]: "-1",
        [numVal]: false
      });
    });
  });

  test("with JavaByte input, should return input wrapped as an ErraiObject", () => {
    const input = new JavaByte("1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.lang.Byte",
      [objectId]: "-1",
      [numVal]: 1
    });
  });

  test("with JavaDouble input, should return input wrapped as an ErraiObject", () => {
    const input = new JavaDouble("1.1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.lang.Double",
      [objectId]: "-1",
      [numVal]: 1.1
    });
  });

  test("with JavaFloat input, should return input wrapped as an ErraiObject", () => {
    const input = new JavaFloat("1.1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.lang.Float",
      [objectId]: "-1",
      [numVal]: 1.1
    });
  });

  test("with JavaInteger input, should return input wrapped as an ErraiObject", () => {
    const input = new JavaInteger("1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.lang.Integer",
      [objectId]: "-1",
      [numVal]: 1
    });
  });

  test("with JavaShort input, should return input wrapped as an ErraiObject", () => {
    const input = new JavaShort("1");

    const output = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [encodedType]: "java.lang.Short",
      [objectId]: "-1",
      [numVal]: 1
    });
  });

  class Pojo implements Portable<Pojo> {
    private readonly _fqcn = "com.app.my.Pojo";

    public foo: string;

    constructor(foo: string) {
      this.foo = foo;
    }
  }
});
