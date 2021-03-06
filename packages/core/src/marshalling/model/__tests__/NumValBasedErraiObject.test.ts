import { NumValBasedErraiObject } from "../NumValBasedErraiObject";
import { ErraiObjectConstants } from "../ErraiObjectConstants";
import { isBoolean, isNumber, isString } from "../../../util/TypeUtils";

describe("asErraiObject", () => {
  describe("with objectId filled", () => {
    test("with numeric numVal, should return correct a well formed Errai Object", () => {
      const input = new NumValBasedErraiObject("com.app.my", 120, "12");

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "12",
        [ErraiObjectConstants.NUM_VAL]: 120
      });
    });

    test("with boolean numVal, should return correct a well formed Errai Object", () => {
      const input = new NumValBasedErraiObject("com.app.my", false, "13");

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "13",
        [ErraiObjectConstants.NUM_VAL]: false
      });
    });

    test("with string numVal, should return correct a well formed Errai Object", () => {
      const input = new NumValBasedErraiObject("com.app.my", "str", "14");

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "14",
        [ErraiObjectConstants.NUM_VAL]: "str"
      });
    });
  });

  describe("with objectId not filled", () => {
    test("with numeric numVal, should return correct a well formed Errai Object applying objId's default", () => {
      const input = new NumValBasedErraiObject("com.app.my", 120);

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "-1",
        [ErraiObjectConstants.NUM_VAL]: 120
      });
    });

    test("with boolean numVal, should return correct a well formed Errai Object applying objId's default", () => {
      const input = new NumValBasedErraiObject("com.app.my", false);

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "-1",
        [ErraiObjectConstants.NUM_VAL]: false
      });
    });

    test("with string numVal, should return correct a well formed Errai Object applying objId's default", () => {
      const input = new NumValBasedErraiObject("com.app.my", "str");

      expect(input.asErraiObject()).toStrictEqual({
        [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
        [ErraiObjectConstants.OBJECT_ID]: "-1",
        [ErraiObjectConstants.NUM_VAL]: "str"
      });
    });
  });
});

describe("from", () => {
  test("with numeric NumVal based errai object instance, should retrieve its data correctly", () => {
    const input = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
      [ErraiObjectConstants.OBJECT_ID]: "125",
      [ErraiObjectConstants.NUM_VAL]: 1
    };

    const output = NumValBasedErraiObject.from(input);

    expect(output.encodedType).toEqual("com.app.my");
    expect(output.objId).toEqual("125");

    expect(isNumber(output.numVal)).toBeTruthy();
    expect(output.numVal).toBe(1);
  });

  test("with boolean NumVal based errai object instance, should retrieve its data correctly", () => {
    const input = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
      [ErraiObjectConstants.OBJECT_ID]: "125",
      [ErraiObjectConstants.NUM_VAL]: false
    };

    const output = NumValBasedErraiObject.from(input);

    expect(output.encodedType).toEqual("com.app.my");
    expect(output.objId).toEqual("125");

    expect(isBoolean(output.numVal)).toBeTruthy();
    expect(output.numVal).toBe(false);
  });

  test("with string NumVal based errai object instance, should retrieve its data correctly", () => {
    const input = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.app.my",
      [ErraiObjectConstants.OBJECT_ID]: "125",
      [ErraiObjectConstants.NUM_VAL]: "str"
    };

    const output = NumValBasedErraiObject.from(input);

    expect(output.encodedType).toEqual("com.app.my");
    expect(output.objId).toEqual("125");

    expect(isString(output.numVal)).toBeTruthy();
    expect(output.numVal).toBe("str");
  });
});
