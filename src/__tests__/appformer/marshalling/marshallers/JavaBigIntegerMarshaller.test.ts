import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import TestUtils from "__tests__/util/TestUtils";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";

describe("marshall", () => {
  test("with regular big integer, should serialize it normally", () => {
    const input = new JavaBigInteger("12");

    const output = new JavaBigIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.math.BigInteger",
      [ErraiObjectConstants.OBJECT_ID]: expect.stringMatching(TestUtils.positiveNumberRegex),
      [ErraiObjectConstants.VALUE]: "12"
    });
  });
});
