import DefaultMarshaller from "appformer/marshalling/marshallers/DefaultMarshaller";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import TestUtils from "__tests__/util/TestUtils";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaBigDecimal from "appformer/java-wrappers/JavaBigDecimal";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaLong from "appformer/java-wrappers/JavaLong";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaString from "appformer/java-wrappers/JavaString";
import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";

describe("marshall", () => {
  const objectId = ErraiObjectConstants.OBJECT_ID;
  const encodedType = ErraiObjectConstants.ENCODED_TYPE;

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
        string: new JavaString("str")
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        bigDecimal: {
          [encodedType]: "java.math.BigDecimal",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [ErraiObjectConstants.VALUE]: "1.1"
        },
        bigInteger: {
          [encodedType]: "java.math.BigInteger",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [ErraiObjectConstants.VALUE]: "2"
        },
        boolean: false,
        byte: 3,
        double: 1.2,
        float: 1.3,
        integer: 4,
        long: {
          [encodedType]: "java.lang.Long",
          [objectId]: "-1",
          [ErraiObjectConstants.NUM_VAL]: "5"
        },
        short: 6,
        string: "str"
      });
    });

    test("custom pojo with collection type, should serialize it normally", () => {
      const input = {
        _fqcn: "com.app.my.Pojo",
        list: ["1", "2", "3"],
        set: new Set(["3", "2", "1"])
        //TODO map support
      };

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "com.app.my.Pojo",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        list: {
          [encodedType]: "java.util.ArrayList",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [ErraiObjectConstants.VALUE]: ["1", "2", "3"]
        },
        set: {
          [encodedType]: "java.util.HashSet",
          [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
          [ErraiObjectConstants.VALUE]: ["3", "2", "1"]
        }
      });
    });
  });

  describe("object caching", () => {
    test("custom pojo with repeated pojo objects, should cache the object and don't repeat data", () => {});

    test("custom pojo with repeated JavaBigDecimal objects, should not cache it", () => {});

    test("custom pojo with repeated JavaBigInteger objects, should not cache it", () => {});

    test("custom pojo with repeated JavaBoolean objects, should not cache it", () => {});

    test("custom pojo with repeated JavaByte objects, should not cache it", () => {});

    test("custom pojo with repeated JavaArrayList objects, should cache the object and don't repeat data", () => {});

    test("custom pojo with repeated JavaHashSet objects, should cache the object and don't repeat data", () => {});

    test("custom pojo with repeated JavaDouble objects, should not cache it", () => {});

    test("custom pojo with repeated JavaFloat objects, should not cache it", () => {});

    test("custom pojo with repeated JavaInteger objects, should not cache it", () => {});

    test("custom pojo with repeated JavaLong objects, should not cache it", () => {});

    test("custom pojo with repeated JavaShort objects, should not cache it", () => {});

    test("custom pojo with repeated JavaString objects, should not cache it", () => {});
  });

  describe("non-pojo root types", () => {
    test("root JavaBigDecimal object, should serialize it normally", () => {
      const input = new JavaBigDecimal("1.2");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.math.BigDecimal",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: "1.2"
      });
    });

    test("root JavaBigInteger object, should serialize it normally", () => {
      const input = new JavaBigInteger("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.math.BigInteger",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: "1"
      });
    });

    test("root JavaBoolean object, should serialize it to boolean raw value", () => {
      const input = new JavaBoolean(false);

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(false);
    });

    test("root JavaByte object, should serialize it to byte raw value", () => {
      const input = new JavaByte("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1);
    });

    test("root JavaArrayList object, should serialize it normally", () => {
      const input = new JavaArrayList(["1", "2", "3"]);

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.util.ArrayList",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: ["1", "2", "3"]
      });
    });

    test("root JavaHashSet object, should serialize it normally", () => {
      const input = new JavaHashSet(new Set(["1", "2", "3"]));

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.util.HashSet",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: ["1", "2", "3"]
      });
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
        [ErraiObjectConstants.NUM_VAL]: "1"
      });
    });

    test("root JavaShort object, should serialize it normally to short raw value", () => {
      const input = new JavaShort("1");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(1);
    });

    test("root JavaString object, should serialize it to string raw value", () => {
      const input = new JavaString("str");

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual("str");
    });

    test("root string object, should serialize it to string raw value", () => {
      const input = "str";

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual("str");
    });

    test("root boolean object, should serialize it normally", () => {
      const input = false;

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toEqual(false);
    });

    test("root number object, should throw error", () => {
      const input = 125.1;

      const marshaller = new DefaultMarshaller();
      const ctx = new MarshallingContext();

      expect(() => marshaller.marshall(input, ctx)).toThrowError();
    });

    test("root array object, should serialize it normally", () => {
      const input = ["1", "2", "3"];

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.util.ArrayList",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: ["1", "2", "3"]
      });
    });

    test("root set object, should serialize it normally", () => {
      const input = new Set(["1", "2", "3"]);

      const output = new DefaultMarshaller().marshall(input, new MarshallingContext());

      expect(output).toStrictEqual({
        [encodedType]: "java.util.HashSet",
        [objectId]: expect.stringMatching(TestUtils.positiveNumberRegex),
        [ErraiObjectConstants.VALUE]: ["1", "2", "3"]
      });
    });
  });
});
