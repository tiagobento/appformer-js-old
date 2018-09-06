import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaIntegerMarshaller from "appformer/marshalling/marshallers/JavaIntegerMarshaller";

describe("marshall", () => {
  test("with regular integer, should return the wrapped value", () => {
    const input = new JavaInteger("2");

    const output = new JavaIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });
});
