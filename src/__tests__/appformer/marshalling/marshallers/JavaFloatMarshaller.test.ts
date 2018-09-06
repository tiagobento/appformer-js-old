import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaFloatMarshaller from "appformer/marshalling/marshallers/JavaFloatMarshaller";

describe("marshall", () => {
  test("with regular float, should return the wrapped value", () => {
    const input = new JavaFloat("2.1");

    const output = new JavaFloatMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2.1);
  });
});
