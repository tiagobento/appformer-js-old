import { MarshallingContext } from "../../MarshallingContext";
import { JavaFloat } from "../../../java-wrappers";
import { JavaFloatMarshaller } from "../JavaFloatMarshaller";
import { UnmarshallingContext } from "../../UnmarshallingContext";
import { NumValBasedErraiObject } from "../../model/NumValBasedErraiObject";
import { JavaType } from "../../../java-wrappers/JavaType";

describe("marshall", () => {
  test("with regular float, should return the same value", () => {
    const input = new JavaFloat("2.1");

    const output = new JavaFloatMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2.1);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaFloatMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaFloatMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});

describe("unmarshall", () => {
  test("with number input, should return a JavaFloat instance", () => {
    const marshaller = new JavaFloatMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = 1.1;
    const output = marshaller.notNullUnmarshall(input, context);

    expect(output).toEqual(new JavaFloat("1.1"));
  });

  test("with ErraiObject regular input, should return a JavaFloat instance", () => {
    const marshaller = new JavaFloatMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = 1.1;
    const marshalledInput = new NumValBasedErraiObject(JavaType.FLOAT, input).asErraiObject();

    const output = marshaller.notNullUnmarshall(marshalledInput, context);

    expect(output).toEqual(new JavaFloat("1.1"));
  });

  test("with non float value, should throw error", () => {
    const marshaller = new JavaFloatMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = "abc" as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.FLOAT, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with null value, should throw error", () => {
    const marshaller = new JavaFloatMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = null as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.FLOAT, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with undefined value, should throw error", () => {
    const marshaller = new JavaFloatMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = undefined as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.FLOAT, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });
});
