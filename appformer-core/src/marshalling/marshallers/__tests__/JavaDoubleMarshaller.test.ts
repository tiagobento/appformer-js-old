import {MarshallingContext} from "../../MarshallingContext";
import {JavaDouble} from "../../../java-wrappers";
import {JavaDoubleMarshaller} from "../JavaDoubleMarshaller";

describe("marshall", () => {
  test("with regular double, should return the same value", () => {
    const input = new JavaDouble("2.1");

    const output = new JavaDoubleMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2.1);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaDoubleMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaDoubleMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
