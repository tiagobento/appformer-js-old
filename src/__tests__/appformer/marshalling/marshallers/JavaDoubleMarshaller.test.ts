import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaDoubleMarshaller from "appformer/marshalling/marshallers/JavaDoubleMarshaller";

describe("marshall", () => {
  test("with regular double, should return the wrapped value", () => {
    const input = new JavaDouble("2.1");

    const output = new JavaDoubleMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2.1);
  });
});
