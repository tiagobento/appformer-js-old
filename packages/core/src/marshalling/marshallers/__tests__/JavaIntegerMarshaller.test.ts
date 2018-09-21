import { MarshallingContext } from "../../MarshallingContext";
import { JavaInteger } from "../../../java-wrappers";
import { JavaIntegerMarshaller } from "../JavaIntegerMarshaller";

describe("marshall", () => {
  test("with regular integer, should return the same value", () => {
    const input = new JavaInteger("2");

    const output = new JavaIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
