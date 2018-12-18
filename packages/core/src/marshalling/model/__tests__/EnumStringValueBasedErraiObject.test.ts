import { ErraiObjectConstants } from "../ErraiObjectConstants";
import { EnumStringValueBasedErraiObject } from "../EnumStringValueBasedErraiObject";

describe("asErraiObject", () => {
  test("with correct inputs, should return correct a well formed Errai Object", () => {
    const input = new EnumStringValueBasedErraiObject("com.app.my", "foo");

    expect(input.asErraiObject()).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
      [ErraiObjectConstants.ENUM_STRING_VALUE]: "foo"
    });
  });
});

describe("from", () => {
  test("with well formed errai object instance, should retrieve its data correctly", () => {
    const input = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
      [ErraiObjectConstants.ENUM_STRING_VALUE]: "foo"
    };

    const output = EnumStringValueBasedErraiObject.from(input);

    expect(output.encodedType).toEqual("com.app.my");
    expect(output.enumValueName).toEqual("foo");
  });
});
