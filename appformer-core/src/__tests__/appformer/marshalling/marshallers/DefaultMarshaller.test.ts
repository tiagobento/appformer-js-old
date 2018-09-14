import DefaultMarshaller from "marshalling/marshallers/DefaultMarshaller";
import MarshallingContext from "marshalling/MarshallingContext";
import ErraiObjectConstants from "marshalling/model/ErraiObjectConstants";
import TestUtils from "__tests__/util/TestUtils";
import MarshallerProvider from "marshalling/MarshallerProvider";
import {JavaInteger} from "java-wrappers/JavaInteger";
import JavaBigDecimal from "java-wrappers/JavaBigDecimal";
import JavaBigInteger from "java-wrappers/JavaBigInteger";
import JavaBoolean from "java-wrappers/JavaBoolean";
import JavaByte from "java-wrappers/JavaByte";
import JavaDouble from "java-wrappers/JavaDouble";
import JavaFloat from "java-wrappers/JavaFloat";
import JavaLong from "java-wrappers/JavaLong";
import JavaShort from "java-wrappers/JavaShort";
import JavaString from "java-wrappers/JavaString";
import JavaArrayList from "java-wrappers/JavaArrayList";
import JavaHashSet from "java-wrappers/JavaHashSet";
import Portable from "internal/model/Portable";
import JavaDate from "java-wrappers/JavaDate";
import JavaOptional from "java-wrappers/JavaOptional";
import JavaHashMap from "java-wrappers/JavaHashMap";

describe("marshall", () => {
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;
  const value = ErraiObjectConstants.VALUE;
  const numVal = ErraiObjectConstants.NUM_VAL;

  beforeEach(() => {
    MarshallerProvider.initialize();
  });

  describe("pojo marshalling", () => {
    test("custom pojo, should return serialize it normally", () => {
      const input = {
        _fqcn: "com.app.my.Pojo",
        name: "my name",
        sendSpam: false,
        age: new JavaInteger("10"),
        address: {
          _fqcn: "com.app.my.Address",
          line1: "address line 1"
        },
        childPojo: {
          _fqcn: "com.app.my.Pojo",
          name: "my name 2",
          sendSpam: true,
          address: {
            _fqcn: "com.app.my.Address",
            line1: "address 2 line 1"
          }
        }
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        name: "my name",
        age: 10,
        sendSpam: false,
        address: {
          [encodedType]: "com.app.my.Address",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          line1: "address line 1"
        },
        childPojo: {
          [encodedType]: "com.app.my.Pojo",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          name: "my name 2",
          sendSpam: true,
          address: {
            [encodedType]: "com.app.my.Address",
            [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
            line1: "address 2 line 1"
          }
        }
      });
    });

    test("custom pojo with function, should serialize it normally and ignore the function", () => {
      const input = {
        _fqcn: "com.app.my.Pojo",
        foo: "bar",
        doSomething: () => {
          return "hey!";
        }
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        foo: "bar"
      });
    });

    test("custom pojo without fqcn, should throw error", () => {
      const input = {
        foo: "bar"
      };

      const context = new MarshallingContext();
      const marshaller = new DefaultMarshaller();

      expect(() => marshaller.marshall(input, context)).toThrowError();
    });

    test("custom pojo with a pojo without fqcn as property, should throw error", () => {
      const input = {
        _fqcn: "com.app.my.Pojo",
        name: "my name",
        childPojo: {
          foo: "bar"
        }
      };

      const context = new MarshallingContext();
      const marshaller = new DefaultMarshaller();

      expect(() => marshaller.marshall(input, context)).toThrowError();
    });

    test("custom pojo with java types, should serialize it normally", () => {
      const date = new Date();

      const input = {
        _fqcn: "com.app.my.Pojo",
        bigDecimal: new JavaBigDecimal("1.1"),
        bigInteger: new JavaBigInteger("2"),
        boolean: new JavaBoolean(false),
        byte: new JavaByte("3"),
        double: new JavaDouble("1.2"),
        float: new JavaFloat("1.3"),
        integer: new JavaInteger("4"),
        long: new JavaLong("5"),
        short: new JavaShort("6"),
        string: new JavaString("str"),
        date: new JavaDate(date),
        optional: new JavaOptional<string>("optstr")
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        bigDecimal: {
          [encodedType]: "java.math.BigDecimal",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: "1.1"
        },
        bigInteger: {
          [encodedType]: "java.math.BigInteger",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: "2"
        },
        boolean: false,
        byte: 3,
        double: 1.2,
        float: 1.3,
        integer: 4,
        long: {
          [encodedType]: "java.lang.Long",
          [objectId]: "-1",
          [numVal]: "5"
        },
        short: 6,
        string: "str",
        date: {
          [encodedType]: "java.util.Date",
          [objectId]: "-1",
          [value]: `${date.getTime()}`
        },
        optional: {
          [encodedType]: "java.util.Optional",
          [objectId]: "-1",
          [value]: "optstr"
        }
      });
    });

    test("custom pojo with collection type, should serialize it normally", () => {
      const input = {
        _fqcn: "com.app.my.Pojo",
        list: ["1", "2", "3"],
        set: new Set(["3", "2", "1"]),
        map: new Map([["k1", "v1"], ["k2", "v2"]])
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        list: {
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: ["1", "2", "3"]
        },
        set: {
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: ["3", "2", "1"]
        },
        map: {
          [encodedType]: "java.util.HashMap",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: {
            k1: "v1",
            k2: "v2"
          }
        }
      });
    });
  });

  describe("object caching", () => {
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

    test("custom pojo with repeated pojo objects, should cache the object and don't repeat data", () => {
      // === scenario

      // repeatedNode appears two times in the hierarchy, all other nodes are unique
      const repeatedNode = new Node({ data: "repeatedNode" });
      const input = new Node({
        data: "root",
        right: new Node({ data: "rightNode", left: repeatedNode, right: new Node({ data: "rightLeaf" }) }),
        left: repeatedNode
      });

      // === test

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      // === assertion
      // expects all nodes to contain their data and a unique objectId, except for the deepest left node.
      // the deepest left node should contain only its encodedType and objectId, which needs to be the same as the root's left node

      const rootObjId = output![objectId];
      expect(output![encodedType]).toEqual("com.app.my.Node");
      expect((output as any)._data).toEqual("root");

      const firstLeftLeaf = (output as any)._left;
      const firstLeftLeafObjId = firstLeftLeaf[objectId];
      expect(firstLeftLeaf._data).toEqual("repeatedNode");

      const rightNodeOut = (output as any)._right;
      const rightNodeObjId = rightNodeOut[objectId];
      expect(rightNodeOut._data).toEqual("rightNode");

      const repeatedLeftLeaf = (rightNodeOut as any)._left;
      const repeatedLeftLeafObjId = repeatedLeftLeaf[objectId];
      expect(repeatedLeftLeaf._data).toBeUndefined();

      const rightLeafOut = (rightNodeOut as any)._right;
      const rightLeafObjId = rightLeafOut[objectId];
      expect(rightLeafOut._data).toEqual("rightLeaf");

      expect(firstLeftLeafObjId).toEqual(repeatedLeftLeafObjId); // reuse same id

      const allObjIds = [rootObjId, firstLeftLeafObjId, rightNodeObjId, repeatedLeftLeafObjId, rightLeafObjId];
      expect(allObjIds.forEach(id => expect(id).toMatch(TestUtils.positiveNumberRegex)));

      // all ids unique (excluding the reused one)
      const uniqueObjIds = new Set(allObjIds);
      expect(uniqueObjIds).toStrictEqual(new Set([rootObjId, firstLeftLeafObjId, rightNodeObjId, rightLeafObjId]));
    });

    test("custom pojo with repeated JavaBigDecimal objects, should not cache it and not reuse data", () => {
      const repeatedValue = new JavaBigDecimal("1.1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaBigDecimal("1.2") }),
        right: new Node({ data: repeatedValue })
      });

      // === test
      const context = new MarshallingContext();
      const output = new DefaultMarshaller().marshall(input, context);

      // === assertions

      const rootObjId = output![objectId];
      const rootDataObjId = (output as any)._data[objectId];
      expect((output as any)._data[value]).toEqual("1.1");

      const leftObjId = (output as any)._left[objectId];
      const leftDataObjId = (output as any)._left._data[objectId];
      expect((output as any)._left._data[value]).toEqual("1.2");

      const rightObjId = (output as any)._right[objectId];
      const rightDataObjId = (output as any)._right._data[objectId];
      expect((output as any)._right._data[value]).toEqual("1.1");

      const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

      allObjectIds.forEach(id => expect(id).toBeDefined());

      // create new object ids even for same obj references
      expect(new Set(allObjectIds)).toStrictEqual(new Set(allObjectIds));

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaBigInteger objects, should not cache it", () => {
      const repeatedValue = new JavaBigInteger("1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaBigInteger("2") }),
        right: new Node({ data: repeatedValue })
      });

      // === test
      const context = new MarshallingContext();
      const output = new DefaultMarshaller().marshall(input, context);

      // === assertions

      const rootObjId = output![objectId];
      const rootDataObjId = (output as any)._data[objectId];
      expect((output as any)._data[value]).toEqual("1");

      const leftObjId = (output as any)._left[objectId];
      const leftDataObjId = (output as any)._left._data[objectId];
      expect((output as any)._left._data[value]).toEqual("2");

      const rightObjId = (output as any)._right[objectId];
      const rightDataObjId = (output as any)._right._data[objectId];
      expect((output as any)._right._data[value]).toEqual("1");

      const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

      allObjectIds.forEach(id => expect(id).toBeDefined());

      // create new object ids even for same obj references
      expect(new Set(allObjectIds)).toStrictEqual(new Set(allObjectIds));

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaBoolean objects, should not cache it", () => {
      const repeatedValue = new JavaBoolean(false);

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaBoolean(true) }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Boolean types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaByte objects, should not cache it", () => {
      const repeatedValue = new JavaByte("1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaByte("2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Byte types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated array objects, should cache the object and don't repeat data", () => {
      const repeatedValue = ["a", "b", "c"];

      const arrayInput = new Node({
        data: repeatedValue,
        left: new Node({ data: ["d", "e"] }),
        right: new Node({ data: repeatedValue })
      });

      const javaArrayListInput = new Node({
        data: new JavaArrayList(repeatedValue),
        left: new Node({ data: new JavaArrayList(["d", "e"]) }),
        right: new Node({ data: new JavaArrayList(repeatedValue) })
      });

      [arrayInput, javaArrayListInput].forEach(input => {
        const context = new MarshallingContext();
        const output = new DefaultMarshaller().marshall(input, context);

        // === assertions

        const rootObjId = output![objectId];
        const rootDataObjId = (output as any)._data[objectId];
        expect((output as any)._data).toStrictEqual({
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.anything(),
          [value]: ["a", "b", "c"]
        });

        const leftObjId = (output as any)._left[objectId];
        const leftDataObjId = (output as any)._left._data[objectId];
        expect((output as any)._left._data).toStrictEqual({
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.anything(),
          [value]: ["d", "e"]
        });

        const rightObjId = (output as any)._right[objectId];
        const rightDataObjId = (output as any)._right._data[objectId];
        expect((output as any)._right._data).toStrictEqual({
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.anything()
          // missing value since it is cached
        });

        const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

        allObjectIds.forEach(id => expect(id).toBeDefined());

        // all ids are unique except for the right data id, that was reused
        expect(new Set(allObjectIds)).toStrictEqual(
          new Set([rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId])
        );

        // do not cache repeated object
        expect(context.getCached(repeatedValue)).toStrictEqual({
          [encodedType]: "java.util.ArrayList",
          [objectId]: rootDataObjId
        });
      });
    });

    test("custom pojo with repeated set objects, should cache the object and don't repeat data", () => {
      const repeatedValue = new Set(["a", "b", "c"]);

      const setInput = new Node({
        data: repeatedValue,
        left: new Node({ data: new Set(["d", "e"]) }),
        right: new Node({ data: repeatedValue })
      });

      const javaHashSetInput = new Node({
        data: new JavaHashSet(repeatedValue),
        left: new Node({ data: new JavaHashSet(new Set(["d", "e"])) }),
        right: new Node({ data: new JavaHashSet(repeatedValue) })
      });

      [setInput, javaHashSetInput].forEach(input => {
        const context = new MarshallingContext();
        const output = new DefaultMarshaller().marshall(input, context);

        // === assertions

        const rootObjId = output![objectId];
        const rootDataObjId = (output as any)._data[objectId];
        expect((output as any)._data).toStrictEqual({
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.anything(),
          [value]: ["a", "b", "c"]
        });

        const leftObjId = (output as any)._left[objectId];
        const leftDataObjId = (output as any)._left._data[objectId];
        expect((output as any)._left._data).toStrictEqual({
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.anything(),
          [value]: ["d", "e"]
        });

        const rightObjId = (output as any)._right[objectId];
        const rightDataObjId = (output as any)._right._data[objectId];
        expect((output as any)._right._data).toStrictEqual({
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.anything()
          // missing value since it is cached
        });

        const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

        allObjectIds.forEach(id => expect(id).toBeDefined());

        // all ids are unique except for the right data id, that was reused
        expect(new Set(allObjectIds)).toStrictEqual(
          new Set([rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId])
        );

        // do not cache repeated object
        expect(context.getCached(repeatedValue)).toStrictEqual({
          [encodedType]: "java.util.HashSet",
          [objectId]: rootDataObjId
        });
      });
    });

    test("custom pojo with repeated map objects, should cache the object and don't repeat data", () => {
      const repeatedMap = new Map([["k1", "v1"]]);

      const mapInput = new Node({
        data: repeatedMap,
        left: new Node({ data: new Map([["k2", "v2"]]) }),
        right: new Node({ data: repeatedMap })
      });

      const javaHashMapInput = new Node({
        data: new JavaHashMap(repeatedMap),
        left: new Node({ data: new JavaHashMap(new Map([["k2", "v2"]])) }),
        right: new Node({ data: new JavaHashMap(repeatedMap) })
      });

      [mapInput, javaHashMapInput].forEach(input => {
        const context = new MarshallingContext();
        const output = new DefaultMarshaller().marshall(input, context);

        // === assertions

        const rootObjId = output![objectId];
        const rootDataObjId = (output as any)._data[objectId];
        expect((output as any)._data).toStrictEqual({
          [encodedType]: "java.util.HashMap",
          [objectId]: expect.anything(),
          [value]: {
            k1: "v1"
          }
        });

        const leftObjId = (output as any)._left[objectId];
        const leftDataObjId = (output as any)._left._data[objectId];
        expect((output as any)._left._data).toStrictEqual({
          [encodedType]: "java.util.HashMap",
          [objectId]: expect.anything(),
          [value]: {
            k2: "v2"
          }
        });

        const rightObjId = (output as any)._right[objectId];
        const rightDataObjId = (output as any)._right._data[objectId];
        expect((output as any)._right._data).toStrictEqual({
          [encodedType]: "java.util.HashMap",
          [objectId]: expect.anything()
          // missing value since it is cached
        });

        const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

        allObjectIds.forEach(id => expect(id).toBeDefined());

        // all ids are unique except for the right data id, that was reused
        expect(new Set(allObjectIds)).toStrictEqual(
          new Set([rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId])
        );

        // do not cache repeated object's data
        expect(context.getCached(repeatedMap)).toStrictEqual({
          [encodedType]: "java.util.HashMap",
          [objectId]: rootDataObjId
        });
      });
    });

    test("custom pojo with repeated JavaDouble objects, should not cache it", () => {
      const repeatedValue = new JavaDouble("1.1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaDouble("1.2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Double types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaFloat objects, should not cache it", () => {
      const repeatedValue = new JavaFloat("1.1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaFloat("1.2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Float types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaInteger objects, should not cache it", () => {
      const repeatedValue = new JavaInteger("1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaInteger("2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Integer types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaLong objects, should not cache it", () => {
      const repeatedValue = new JavaLong("1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaLong("2") }),
        right: new Node({ data: repeatedValue })
      });

      // === test
      const context = new MarshallingContext();
      const output = new DefaultMarshaller().marshall(input, context);

      // === assertions

      const rootObjId = output![objectId];
      const rootDataObjId = (output as any)._data[objectId];
      expect((output as any)._data[numVal]).toEqual("1");

      const leftObjId = (output as any)._left[objectId];
      const leftDataObjId = (output as any)._left._data[objectId];
      expect((output as any)._left._data[numVal]).toEqual("2");

      const rightObjId = (output as any)._right[objectId];
      const rightDataObjId = (output as any)._right._data[objectId];
      expect((output as any)._right._data[numVal]).toEqual("1");

      const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

      allObjectIds.forEach(id => expect(id).toBeDefined());

      // create new object ids even for same obj references
      expect(new Set(allObjectIds)).toStrictEqual(new Set(allObjectIds));

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaShort objects, should not cache it", () => {
      const repeatedValue = new JavaShort("1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaShort("2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because Short types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaString objects, should not cache it", () => {
      const repeatedValue = new JavaString("str1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaString("str2") }),
        right: new Node({ data: repeatedValue })
      });

      const context = new MarshallingContext();
      new DefaultMarshaller().marshall(input, context);

      // in this test we're not interested in the output structure, because String types are not wrapped into an
      // ErraiObject, so, it doesn't even have an objectId assigned.

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });

    test("custom pojo with repeated JavaOptional objects, should not cache it", () => {
      const repeatedValue = new JavaOptional<string>("str1");

      const input = new Node({
        data: repeatedValue,
        left: new Node({ data: new JavaOptional<string>("str2") }),
        right: new Node({ data: repeatedValue })
      });

      // === test
      const context = new MarshallingContext();
      const output = new DefaultMarshaller().marshall(input, context);

      // === assertions

      const rootObjId = output![objectId];
      const rootDataObjId = (output as any)._data[objectId];
      expect((output as any)._data[value]).toStrictEqual("str1");

      const leftObjId = (output as any)._left[objectId];
      const leftDataObjId = (output as any)._left._data[objectId];
      expect((output as any)._left._data[value]).toEqual("str2");

      const rightObjId = (output as any)._right[objectId];
      const rightDataObjId = (output as any)._right._data[objectId];
      expect((output as any)._right._data[value]).toEqual("str1");

      const allObjectIds = [rootObjId, rootDataObjId, leftObjId, leftDataObjId, rightObjId, rightDataObjId];

      allObjectIds.forEach(id => expect(id).toBeDefined());

      // optional objects always use the same object id (its value doesn't matter)
      expect(new Set(allObjectIds)).toStrictEqual(new Set([rootObjId, rootDataObjId, leftObjId, rightObjId]));
      expect(rootDataObjId).toEqual(leftDataObjId);
      expect(rootDataObjId).toEqual(rightDataObjId);

      // do not cache repeated object
      expect(context.getCached(repeatedValue)).toBeUndefined();
    });
  });

  describe("non-pojo root types", () => {
    test("root null object, should serialize to null", () => {
      const input = null as any;

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toBeNull();
    });

    test("root undefined object, should serialize to null", () => {
      const input = undefined as any;

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toBeNull();
    });

    test("root JavaBigDecimal object, should serialize it normally", () => {
      const input = new JavaBigDecimal("1.2");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.math.BigDecimal",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: "1.2"
      });
    });

    test("root JavaBigInteger object, should serialize it normally", () => {
      const input = new JavaBigInteger("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.math.BigInteger",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [value]: "1"
      });
    });

    test("root JavaByte object, should serialize it to byte raw value", () => {
      const input = new JavaByte("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1);
    });

    test("root JavaDouble object, should serialize it to double raw value", () => {
      const input = new JavaDouble("1.1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1.1);
    });

    test("root JavaFloat object, should serialize it to float raw value", () => {
      const input = new JavaFloat("1.1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1.1);
    });

    test("root JavaInteger object, should serialize it to integer raw value", () => {
      const input = new JavaInteger("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1);
    });

    test("root JavaLong object, should serialize it normally", () => {
      const input = new JavaLong("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.lang.Long",
        [objectId]: "-1",
        [numVal]: "1"
      });
    });

    test("root JavaShort object, should serialize it normally to short raw value", () => {
      const input = new JavaShort("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1);
    });

    test("root JavaOptional object, should serialize it normally", () => {
      const input = new JavaOptional<string>("str");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.util.Optional",
        [objectId]: "-1",
        [value]: "str"
      });
    });

    test("root string object, should serialize it to string raw value", () => {
      const stringInput = "str";
      const javaStringInput = new JavaString("str");

      [stringInput, javaStringInput].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toEqual("str");
      });
    });

    test("root date object, should serialize it normally", () => {
      const date = new Date();
      const javaDate = new JavaDate(date);

      [date, javaDate].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toStrictEqual({
          [encodedType]: "java.util.Date",
          [objectId]: "-1",
          [value]: `${date.getTime()}`
        });
      });
    });

    test("root boolean object, should serialize it to boolean raw value", () => {
      const booleanInput = false;
      const javaBooleanInput = new JavaBoolean(false);

      [booleanInput, javaBooleanInput].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toEqual(false);
      });
    });

    test("root number object, should throw error", () => {
      const input = 125.1;

      const marshaller = new DefaultMarshaller();
      const ctx = new MarshallingContext();

      expect(() => marshaller.marshall(input, ctx)).toThrowError();
    });

    test("root array object, should serialize it normally", () => {
      const arrayInput = ["1", "2", "3"];
      const javaArrayListInput = new JavaArrayList(["1", "2", "3"]);

      [arrayInput, javaArrayListInput].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toStrictEqual({
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: ["1", "2", "3"]
        });
      });
    });

    test("root set object, should serialize it normally", () => {
      const setInput = new Set(["1", "2", "3"]);
      const javaHashSetInput = new JavaHashSet(new Set(["1", "2", "3"]));

      [setInput, javaHashSetInput].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toStrictEqual({
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: ["1", "2", "3"]
        });
      });
    });

    test("root map object, should serialize it normally", () => {
      const mapInput = new Map([["k1", "v1"], ["k2", "v2"]]);
      const javaHashMapInput = new JavaHashMap(new Map([["k1", "v1"], ["k2", "v2"]]));

      [mapInput, javaHashMapInput].forEach(input => {
        const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

        expect(output).toStrictEqual({
          [encodedType]: "java.util.HashMap",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [value]: {
            k1: "v1",
            k2: "v2"
          }
        });
      });
    });
  });
});
