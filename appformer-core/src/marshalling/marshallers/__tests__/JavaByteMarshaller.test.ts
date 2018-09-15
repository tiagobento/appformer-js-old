import {MarshallingContext} from "marshalling/MarshallingContext";
import {JavaByte} from "../../../java-wrappers/JavaByte";
import {JavaByteMarshaller} from "..//JavaByteMarshaller";

describe("marshall", () => {
  test("with regular byte, should return same value", () => {
    const input = new JavaByte("2");

    const output = new JavaByteMarshaller().marshall(input, new MarshallingContext());

    expect(output).toStrictEqual(2);
  });

  test("root null object, should serialize to null", () => {
    const input = null as any;

    const output = new JavaByteMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });

  test("root undefined object, should serialize to null", () => {
    const input = undefined as any;

    const output = new JavaByteMarshaller().marshall(input, new MarshallingContext());

    expect(output).toBeNull();
  });
});
