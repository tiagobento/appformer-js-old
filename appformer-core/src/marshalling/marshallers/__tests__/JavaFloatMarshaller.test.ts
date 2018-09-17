import { MarshallingContext } from "../../MarshallingContext";
import { JavaFloat } from "../../../java-wrappers";
import { JavaFloatMarshaller } from "../JavaFloatMarshaller";

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
