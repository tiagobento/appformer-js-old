import { JavaArrayListMarshaller } from "appformer/marshalling/marshallers/JavaCollectionMarshaller";
import JavaArrayList from "appformer/java-wrapper/JavaArrayList";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaInteger from "appformer/java-wrapper/JavaInteger";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaBigInteger from "appformer/java-wrapper/JavaBigInteger";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import Portable from "appformer/internal/model/Portable";

describe("marshall", () => {
  const positiveNumberRegex = new RegExp(/^\d*[1-9]$/);

  beforeEach(() => {
    MarshallerProvider.initialize();
  });

  test("with empty array, should serialize normally", () => {
    const input = new JavaArrayList([]);

    const output = new JavaArrayListMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.util.ArrayList",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: []
    });
  });

  test("with JavaNumber array, should wrap every element into an errai object", () => {
    const numberArray = [new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3")];
    const input = new JavaArrayList(numberArray);

    const output = new JavaArrayListMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.util.ArrayList",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: [
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Integer",
          [ErraiObjectConstants.OBJECT_ID]: "-1",
          [ErraiObjectConstants.NUM_VAL]: 1
        },
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Integer",
          [ErraiObjectConstants.OBJECT_ID]: "-1",
          [ErraiObjectConstants.NUM_VAL]: 2
        },
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Integer",
          [ErraiObjectConstants.OBJECT_ID]: "-1",
          [ErraiObjectConstants.NUM_VAL]: 3
        }
      ]
    });
  });

  test("with JavaBigNumber array, should serialize every element normally", () => {
    const context = new MarshallingContext();
    const bigIntegerMarshaller = new JavaBigIntegerMarshaller();

    const bigNumberArray = [new JavaBigInteger("1"), new JavaBigInteger("2"), new JavaBigInteger("3")];
    const input = new JavaArrayList(bigNumberArray);

    const output = new JavaArrayListMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.util.ArrayList",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: [
        {
          ...(bigIntegerMarshaller.marshall(new JavaBigInteger("1"), context) as any),
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex)
        },
        {
          ...(bigIntegerMarshaller.marshall(new JavaBigInteger("2"), context) as any),
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex)
        },
        {
          ...(bigIntegerMarshaller.marshall(new JavaBigInteger("3"), context) as any),
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex)
        }
      ]
    });
  });

  test("with custom object array, should serialize every element normally", () => {
    const context = new MarshallingContext();

    const portableArray = [
      new MyPortable({ foo: "foo1", bar: "bar1" }),
      new MyPortable({ foo: "foo2", bar: "bar2" }),
      new MyPortable({ foo: "foo3", bar: "bar3" })
    ];
    const input = new JavaArrayList(portableArray);

    const output = new JavaArrayListMarshaller().marshall(input, context);

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.util.ArrayList",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: [
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
          foo: "foo1",
          bar: "bar1"
        },
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
          foo: "foo2",
          bar: "bar2"
        },
        {
          [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
          [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(positiveNumberRegex),
          foo: "foo3",
          bar: "bar3"
        }
      ]
    });
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
