import { MarshallingContext } from "../../MarshallingContext";
import { JavaString } from "../../../java-wrappers";
import { JavaStringMarshaller } from "../JavaStringMarshaller";

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
