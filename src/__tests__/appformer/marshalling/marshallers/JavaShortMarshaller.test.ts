import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaShortMarshaller from "appformer/marshalling/marshallers/JavaShortMarshaller";

describe("marshall", () => {
  test("with regular short, should return the same value", () => {
    const input = new JavaShort("2");

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaShortMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
