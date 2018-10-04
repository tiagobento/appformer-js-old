import { MarshallingContext } from "../../MarshallingContext";
import { JavaLong } from "../../../java-wrappers";
import { JavaLongMarshaller } from "../JavaLongMarshaller";
import { NumValBasedErraiObject } from "../../model/NumValBasedErraiObject";
import { UnmarshallingContext } from "../../UnmarshallingContext";
import { JavaType } from "../../../java-wrappers/JavaType";
import { JavaIntegerMarshaller } from "../JavaIntegerMarshaller";

describe("marshall", () => {
  test("with regular long, should should serialize it normally", () => {
    const input = new JavaLong("2");

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    const expected = new NumValBasedErraiObject(JavaType.LONG, "2").asErraiObject();
    expect(output).toStrictEqual(expected);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});

describe("unmarshall", () => {
  test("with regular input, should return a JavaLong instance", () => {
    const marshaller = new JavaLongMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = new JavaLong("125");
    const marshalledInput = marshaller.notNullMarshall(input, new MarshallingContext());

    const output = marshaller.notNullUnmarshall(marshalledInput, context);

    expect(output.get()).toEqual(input.get());
  });

  test("with float string value, should throw error", () => {
    const marshaller = new JavaIntegerMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = "1.2";
    const marshalledInput = new NumValBasedErraiObject(JavaType.INTEGER, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with non numeric string value, should throw error", () => {
    const marshaller = new JavaIntegerMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = "abc" as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.INTEGER, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with null value, should throw error", () => {
    const marshaller = new JavaIntegerMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = null as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.INTEGER, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with undefined value, should throw error", () => {
    const marshaller = new JavaIntegerMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = undefined as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.INTEGER, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });
});
