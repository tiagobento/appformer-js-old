import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import * as Marshalling from "appformer/marshalling/Marshalling";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

describe("marshall", () => {
  test("with regular input, should return an errai object json-string version of it", () => {
    const input = new JavaInteger("1");
    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Integer",
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: 1
    };

    const expectedJson = JSON.stringify(inputErraiObject);

    // skip actual marshaller implementation
    const mockedMarshaller = { marshall: jest.fn(() => inputErraiObject) };
    MarshallerProvider.getFor = jest.fn(() => mockedMarshaller);

    // ==
    // ====== test
    const output = Marshalling.marshall(input);

    // == assertion
    expect(expectedJson).toEqual(output);
  });

  test("with null input, should return null", () => {
    const input = null as any;

    const output = Marshalling.marshall(input);

    expect(output).toBeNull();
  });

  test("with undefined input, should serialize marshaller output", () => {
    const input = undefined as any;

    const output = Marshalling.marshall(input);

    expect(output).toBeNull();
  });
});
