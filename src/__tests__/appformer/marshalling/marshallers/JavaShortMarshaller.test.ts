import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaShortMarshaller from "appformer/marshalling/marshallers/JavaShortMarshaller";

describe("marshall", () => {
  test("with regular short, should return the wrapped value", () => {
    const input = new JavaShort("2");

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });
});
