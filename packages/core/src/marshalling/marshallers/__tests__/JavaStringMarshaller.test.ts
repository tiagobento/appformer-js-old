import { MarshallingContext } from "../../MarshallingContext";
import { JavaString } from "../../../java-wrappers";
import { JavaStringMarshaller } from "../JavaStringMarshaller";
import { UnmarshallingContext } from "../../UnmarshallingContext";

describe("marshall", () => {
  test("with regular string, should return the same value", () => {
    const input = new JavaString("str");

    const output = new JavaStringMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual("str");
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaStringMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaStringMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});

describe("unmarshall", () => {
  test("with string value, should return same string", () => {
    const marshaller = new JavaStringMarshaller();

    const input = new JavaString("foo");

    const marshalledInput = marshaller.notNullMarshall(input, new MarshallingContext());

    const output = marshaller.notNullUnmarshall(marshalledInput, new UnmarshallingContext(new Map()));

    expect(output).toEqual("foo");
  });

  test("with JavaString value, should return inner string", () => {
    const marshaller = new JavaStringMarshaller();

    const input = new JavaString("foo");

    const output = marshaller.notNullUnmarshall(input, new UnmarshallingContext(new Map()));

    expect(output).toEqual("foo");
  });
});
