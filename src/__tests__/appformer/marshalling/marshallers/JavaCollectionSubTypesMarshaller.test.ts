import {
  JavaArrayListMarshaller,
  JavaHashSetMarshaller
} from "appformer/marshalling/marshallers/JavaCollectionMarshaller";
import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import Portable from "appformer/internal/model/Portable";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";
import TestUtils from "__tests__/util/TestUtils";

describe("marshall", () => {
  let context: MarshallingContext;

  beforeEach(() => {
    MarshallerProvider.initialize();
    context = new MarshallingContext();
  });

  test("with empty collection, should serialize normally", () => {
    const arrayListScenario = () => {
      const input = new JavaArrayList([]);
      return { fqcn: "java.util.ArrayList", output: new JavaArrayListMarshaller().marshall(input, context) };
    };

    const hashSetScenario = () => {
      const input = new JavaHashSet(new Set([]));
      return { fqcn: "java.util.HashSet", output: new JavaHashSetMarshaller().marshall(input, context) };
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const { fqcn, output } = outputFunc();

      expect(output).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: fqcn,
        [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: []
      });
    });
  });

  test("with JavaNumber collection, should wrap every element into an errai object", () => {
    const numberArray = [new JavaInteger("1"), new JavaInteger("2"), new JavaInteger("3")];

    const arrayListScenario = () => {
      const input = new JavaArrayList(numberArray);
      return { fqcn: "java.util.ArrayList", output: new JavaArrayListMarshaller().marshall(input, context) };
    };

    const hashSetScenario = () => {
      const input = new JavaHashSet(new Set(numberArray));
      return { fqcn: "java.util.HashSet", output: new JavaHashSetMarshaller().marshall(input, context) };
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const { fqcn, output } = outputFunc();

      expect(output).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: fqcn,
        [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
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
  });

  test("with JavaBigNumber array, should serialize every element normally", () => {
    const bigIntegerMarshaller = new JavaBigIntegerMarshaller();

    const bigNumberArray = [new JavaBigInteger("1"), new JavaBigInteger("2"), new JavaBigInteger("3")];

    const arrayListScenario = () => {
      const input = new JavaArrayList(bigNumberArray);
      return { fqcn: "java.util.ArrayList", output: new JavaArrayListMarshaller().marshall(input, context) };
    };

    const hashSetScenario = () => {
      const input = new JavaHashSet(new Set(bigNumberArray));
      return { fqcn: "java.util.HashSet", output: new JavaHashSetMarshaller().marshall(input, context) };
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const { fqcn, output } = outputFunc();

      expect(output).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: fqcn,
        [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: [
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("1"), context) as any),
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex)
          },
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("2"), context) as any),
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex)
          },
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("3"), context) as any),
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex)
          }
        ]
      });
    });
  });

  test("with custom object array, should serialize every element normally", () => {
    const portableArray = [
      new MyPortable({ foo: "foo1", bar: "bar1" }),
      new MyPortable({ foo: "foo2", bar: "bar2" }),
      new MyPortable({ foo: "foo3", bar: "bar3" })
    ];

    const arrayListScenario = () => {
      const input = new JavaArrayList(portableArray);
      return {
        fqcn: "java.util.ArrayList",
        output: new JavaArrayListMarshaller().marshall(input, new MarshallingContext())
      };
    };

    const hashSetScenario = () => {
      const input = new JavaHashSet(new Set(portableArray));
      return {
        fqcn: "java.util.HashSet",
        output: new JavaHashSetMarshaller().marshall(input, new MarshallingContext())
      };
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const { fqcn, output } = outputFunc();

      expect(output).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: fqcn,
        [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: [
          {
            [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo1",
            bar: "bar1"
          },
          {
            [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo2",
            bar: "bar2"
          },
          {
            [ErraiObjectConstants.ENCODED_TYPE]: "com.portable.my",
            [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo3",
            bar: "bar3"
          }
        ]
      });
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
