import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaLong from "appformer/java-wrappers/JavaLong";
import JavaLongMarshaller from "appformer/marshalling/marshallers/JavaLongMarshaller";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

describe("marshall", () => {
  test("with regular long, should should serialize it normally", () => {
    const input = new JavaLong("2");

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Long",
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: "2"
    });
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaLongMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
