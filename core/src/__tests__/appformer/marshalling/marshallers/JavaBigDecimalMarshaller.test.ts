import JavaBigDecimal from "appformer/java-wrappers/JavaBigDecimal";
import JavaBigDecimalMarshaller from "appformer/marshalling/marshallers/JavaBigDecimalMarshaller";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import TestUtils from "__tests__/util/TestUtils";

describe("marshall", () => {
  test("with regular big decimal, should serialize it normally", () => {
    const input = new JavaBigDecimal("12.12");

    const output = new JavaBigDecimalMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.math.BigDecimal",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: "12.12"
    });
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaBigDecimalMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaBigDecimalMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
