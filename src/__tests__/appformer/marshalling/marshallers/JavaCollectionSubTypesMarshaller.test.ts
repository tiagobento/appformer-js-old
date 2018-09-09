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
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";

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
        [encodedType]: fqcn,
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: []
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
        [encodedType]: fqcn,
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
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

  test("with JavaBoolean collection, should wrap every element into an errai object", () => {
    const booleanArray = [new JavaBoolean(true), new JavaBoolean(false)];

    const arrayListScenario = () => {
      const input = new JavaArrayList(booleanArray);
      return { fqcn: "java.util.ArrayList", output: new JavaArrayListMarshaller().marshall(input, context) };
    };

    const hashSetScenario = () => {
      const input = new JavaHashSet(new Set(booleanArray));
      return { fqcn: "java.util.HashSet", output: new JavaHashSetMarshaller().marshall(input, context) };
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const { fqcn, output } = outputFunc();

      expect(output).toStrictEqual({
        [encodedType]: fqcn,
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: [
          {
            [encodedType]: "java.lang.Boolean",
            [objectId]: "-1",
            [numVal]: true
          },
          {
            [encodedType]: "java.lang.Boolean",
            [objectId]: "-1",
            [numVal]: false
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
        [encodedType]: fqcn,
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: [
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("1"), context) as any),
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex)
          },
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("2"), context) as any),
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex)
          },
          {
            ...(bigIntegerMarshaller.marshall(new JavaBigInteger("3"), context) as any),
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex)
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
        [encodedType]: fqcn,
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: [
          {
            [encodedType]: "com.portable.my",
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo1",
            bar: "bar1"
          },
          {
            [encodedType]: "com.portable.my",
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo2",
            bar: "bar2"
          },
          {
            [encodedType]: "com.portable.my",
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
            foo: "foo3",
            bar: "bar3"
          }
        ]
      });
    });
  });

  test("with custom pojo array containing repeated elements, should cache inner objects and don't repeat data", () => {
    const repeatedValue = new Node({ data: "foo1" });

    const portableArray = [repeatedValue, new Node({ data: "foo2", right: repeatedValue })];

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

      const rootObjId = output![objectId];
      expect(output![encodedType]).toEqual(fqcn);
      expect(rootObjId).toMatch(TestUtils.positiveNumberRegex);

      const rootObjValue = output![value] as any[];

      const foo2Objects = rootObjValue.filter(obj => obj._data === "foo2");
      expect(foo2Objects.length).toEqual(1);
      const uniqueObjId = foo2Objects[0][objectId];
      expect(uniqueObjId).toMatch(TestUtils.positiveNumberRegex);

      const repeatedObjects = rootObjValue.filter(obj => obj._data !== "foo2");
      expect(repeatedObjects.length).toEqual(1);
      const repeatedObjId = repeatedObjects[0][objectId];
      expect(repeatedObjId).toMatch(TestUtils.positiveNumberRegex);

      expect(rootObjValue).toEqual([
        { [encodedType]: "com.app.my.Node", [objectId]: repeatedObjId, _data: "foo1", _left: null, _right: null },
        {
          [encodedType]: "com.app.my.Node",
          [objectId]: uniqueObjId,
          _data: "foo2",
          _right: { [encodedType]: "com.app.my.Node", [objectId]: repeatedObjId },
          _left: null
        }
      ]);
    });
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const arrayListScenario = () => {
      return new JavaArrayListMarshaller().marshall(input, new MarshallingContext());
    };

    const hashSetScenario = () => {
      return new JavaHashSetMarshaller().marshall(input, new MarshallingContext());
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const output = outputFunc();
      expect(output).toBeNull();
    });
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const arrayListScenario = () => {
      return new JavaArrayListMarshaller().marshall(input, new MarshallingContext());
    };

    const hashSetScenario = () => {
      return new JavaHashSetMarshaller().marshall(input, new MarshallingContext());
    };

    [arrayListScenario, hashSetScenario].forEach(outputFunc => {
      const output = outputFunc();
      expect(output).toBeNull();
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
