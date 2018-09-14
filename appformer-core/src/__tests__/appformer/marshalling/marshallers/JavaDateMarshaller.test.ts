import {MarshallingContext} from "marshalling/MarshallingContext";
import {ErraiObjectConstants} from "marshalling/model/ErraiObjectConstants";
import {JavaDate} from "java-wrappers/JavaDate";
import {JavaDateMarshaller} from "marshalling/marshallers/JavaDateMarshaller";

describe("marshall", () => {
  test("with regular date, should should serialize it normally", () => {
    const date = new Date();

    const input = new JavaDate(date);

    const output = new JavaDateMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "java.util.Date",
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${date.getTime()}`
    });
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaDateMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaDateMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
