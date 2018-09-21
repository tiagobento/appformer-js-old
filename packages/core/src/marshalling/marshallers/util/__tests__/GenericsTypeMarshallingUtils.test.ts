import {
  JavaArrayList,
  JavaBigDecimal,
  JavaBigInteger,
  JavaBoolean,
  JavaByte,
  JavaDate,
  JavaDouble,
  JavaFloat,
  JavaHashMap,
  JavaHashSet,
  JavaInteger,
  JavaLong,
  JavaOptional,
  JavaShort,
  JavaString
} from "../../../../java-wrappers";
import { GenericsTypeMarshallingUtils } from "../GenericsTypeMarshallingUtils";
import { MarshallingContext } from "../../../MarshallingContext";
import { JavaArrayListMarshaller, JavaHashSetMarshaller } from "../../JavaCollectionMarshaller";
import { ErraiObjectConstants } from "../../../model/ErraiObjectConstants";
import { MarshallerProvider } from "../../../MarshallerProvider";
import { JavaBigDecimalMarshaller } from "../../JavaBigDecimalMarshaller";
import { JavaBigIntegerMarshaller } from "../../JavaBigIntegerMarshaller";
import { JavaHashMapMarshaller } from "../../JavaHashMapMarshaller";
import { JavaLongMarshaller } from "../../JavaLongMarshaller";
import { JavaStringMarshaller } from "../../JavaStringMarshaller";
import { JavaDateMarshaller } from "../../JavaDateMarshaller";
import { DefaultMarshaller } from "../../DefaultMarshaller";
import { Portable } from "../../../../internal";
import { JavaOptionalMarshaller } from "../../JavaOptionalMarshaller";

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
