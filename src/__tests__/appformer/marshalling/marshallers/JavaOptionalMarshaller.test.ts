import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import Portable from "appformer/internal/model/Portable";
import TestUtils from "__tests__/util/TestUtils";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaOptional from "appformer/java-wrappers/JavaOptional";
import JavaOptionalMarshaller from "appformer/marshalling/marshallers/JavaOptionalMarshaller";

describe("marshall", () => {
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const value = ErraiObjectConstants.VALUE;
  const numVal = ErraiObjectConstants.NUM_VAL;

  let context: MarshallingContext;

  beforeEach(() => {
    MarshallerProvider.initialize();
    context = new MarshallingContext();
  });

  test("with empty optional, should serialize normally", () => {
    const input = new JavaOptional<string>(undefined);

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.Optional",
      [objectId]: "-1",
      [value]: null
    });
  });

  test("with JavaNumber optional, should wrap element into an errai object", () => {
    const input = new JavaOptional<JavaInteger>(new JavaInteger("1"));

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.Optional",
      [objectId]: "-1",
      [value]: {
        [encodedType]: "java.lang.Integer",
        [objectId]: "-1",
        [numVal]: 1
      }
    });
  });

  test("with JavaBoolean optional, should wrap element into an errai object", () => {
    const input = new JavaOptional<JavaBoolean>(new JavaBoolean(false));

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.Optional",
      [objectId]: "-1",
      [value]: {
        [encodedType]: "java.lang.Boolean",
        [objectId]: "-1",
        [numVal]: false
      }
    });
  });

  test("with JavaBigNumber optional, should serialize element normally", () => {
    const input = new JavaOptional<JavaBigInteger>(new JavaBigInteger("1"));

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.Optional",
      [objectId]: "-1",
      [value]: {
        [encodedType]: "java.math.BigInteger",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: "1"
      }
    });
  });

  test("with custom object optional, should serialize element normally", () => {
    const input = new JavaOptional<MyPortable>(new MyPortable({ foo: "foo1", bar: "bar1" }));

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [encodedType]: "java.util.Optional",
      [objectId]: "-1",
      [value]: {
        [encodedType]: "com.portable.my",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        foo: "foo1",
        bar: "bar1"
      }
    });
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaOptionalMarshaller().marshall(input, context);

    expect(output).toBeNull();
  });
});

class MyPortable implements Portable<MyPortable> {
  private readonly _fqcn = "com.portable.my";

  public readonly foo: string;
  public readonly bar: string;

  constructor(self: { foo: string; bar: string }) {
    this.foo = self.foo;
    this.bar = self.bar;
  }
}

class Node implements Portable<Node> {
  private readonly _fqcn = "com.app.my.Node";

  public readonly _data: any;
  public readonly _left?: Node;
  public readonly _right?: Node;

  constructor(self: { data: any; left?: Node; right?: Node }) {
    this._data = self.data;
    this._left = self.left;
    this._right = self.right;
  }
}
