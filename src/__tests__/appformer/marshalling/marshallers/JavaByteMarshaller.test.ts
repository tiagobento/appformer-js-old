import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaByteMarshaller from "appformer/marshalling/marshallers/JavaByteMarshaller";

describe("marshall", () => {
  test("with regular byte, should return the wrapped value", () => {
    const input = new JavaByte("2");

    const output = new JavaByteMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });
});
