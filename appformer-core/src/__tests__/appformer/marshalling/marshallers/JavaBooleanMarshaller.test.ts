import {MarshallingContext} from "marshalling/MarshallingContext";
import {JavaBoolean} from "java-wrappers/JavaBoolean";
import {JavaBooleanMarshaller} from "marshalling/marshallers/JavaBooleanMarshaller";

describe("marshall", () => {
  test("with regular boolean, should return the same value", () => {
    const input = new JavaBoolean(false);

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(false);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaBooleanMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
