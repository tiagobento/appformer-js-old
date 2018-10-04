import { MarshallingContext } from "../../MarshallingContext";
import { JavaBoolean } from "../../../java-wrappers";
import { JavaBooleanMarshaller } from "../JavaBooleanMarshaller";
import { UnmarshallingContext } from "../../UnmarshallingContext";
import { JavaType } from "../../../java-wrappers/JavaType";
import { NumValBasedErraiObject } from "../../model/NumValBasedErraiObject";

describe("marshall", () => {
  test("with regular boolean, should return the same value", () => {
    const input = new JavaBoolean(false);

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(false);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});

describe("unmarshall", () => {
  test("with boolean input, should return a boolean instance", () => {
    const marshaller = new JavaBooleanMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = true;
    const output = marshaller.notNullUnmarshall(input, context);

    expect(output).toBeTruthy();
  });

  test("with ErraiObject regular input, should return a boolean instance", () => {
    const marshaller = new JavaBooleanMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = false;
    const marshalledInput = new NumValBasedErraiObject(JavaType.BOOLEAN, input).asErraiObject();

    const output = marshaller.notNullUnmarshall(marshalledInput, context);

    expect(output).toBeFalsy();
  });

  test("with non boolean value, should throw error", () => {
    const marshaller = new JavaBooleanMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = "abc" as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.BOOLEAN, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with null value, should throw error", () => {
    const marshaller = new JavaBooleanMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = null as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.BOOLEAN, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });

  test("with undefined value, should throw error", () => {
    const marshaller = new JavaBooleanMarshaller();
    const context = new UnmarshallingContext(new Map());

    const input = undefined as any;
    const marshalledInput = new NumValBasedErraiObject(JavaType.BOOLEAN, input).asErraiObject();

    expect(() => marshaller.notNullUnmarshall(marshalledInput, context)).toThrowError();
  });
});
