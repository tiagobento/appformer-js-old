import {MarshallingContext} from "marshalling/MarshallingContext";
import {ErraiObjectConstants} from "marshalling/model/ErraiObjectConstants";
import {TestUtils} from "__tests__/util/TestUtils";
import {JavaBigInteger} from "../../../java-wrappers/JavaBigInteger";
import {JavaBigIntegerMarshaller} from "..//JavaBigIntegerMarshaller";

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

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaBigIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaBigIntegerMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
