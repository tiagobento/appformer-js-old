import { MarshallingContext } from "../../MarshallingContext";
import { JavaShort } from "../../../java-wrappers";
import { JavaShortMarshaller } from "../JavaShortMarshaller";
import { UnmarshallingContext } from "../../UnmarshallingContext";
import { NumValBasedErraiObject } from "../../model/NumValBasedErraiObject";
import { JavaType } from "../../../java-wrappers/JavaType";

describe("marshall", () => {
  test("with regular short, should return the same value", () => {
    const input = new JavaShort("2");

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});

describe("unmarshall", () => {
  describe("number input", () => {
    test("with short, should return a JavaShort instance", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = 1;
      const output = marshaller.notNullUnmarshall(input, context);

      expect(output).toEqual(new JavaShort("1"));
    });

    test("with float, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = 1.2;

      expect(() => marshaller.notNullUnmarshall(input, context)).toThrowError();
    });

    test("with string, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = "abc" as any;

      expect(() => marshaller.notNullUnmarshall(input, context)).toThrowError();
    });

    test("with null, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = null as any;

      expect(() => marshaller.notNullUnmarshall(input, context)).toThrowError();
    });

    test("with undefined, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = undefined as any;

      expect(() => marshaller.notNullUnmarshall(input, context)).toThrowError();
    });
  });

  describe("ErraiObject input", () => {
    test("with short, should return a JavaShort instance", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = 1;
      const marshalledInput = new NumValBasedErraiObject(JavaType.SHORT, input).asErraiObject();

      const output = marshaller.notNullUnmarshall(marshalledInput, context);

      expect(output).toEqual(new JavaShort("1"));
    });

    test("with float, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = 1.2;
      const marshalledInput = new NumValBasedErraiObject(JavaType.SHORT, input).asErraiObject();

      expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
    });

    test("with string, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = "abc" as any;
      const marshalledInput = new NumValBasedErraiObject(JavaType.SHORT, input).asErraiObject();

      expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
    });

    test("with null, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = null as any;
      const marshalledInput = new NumValBasedErraiObject(JavaType.SHORT, input).asErraiObject();

      expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
    });

    test("with undefined, should throw error", () => {
      const marshaller = new JavaShortMarshaller();
      const context = new UnmarshallingContext(new Map());

      const input = undefined as any;
      const marshalledInput = new NumValBasedErraiObject(JavaType.SHORT, input).asErraiObject();

      expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
    });
  });
});
