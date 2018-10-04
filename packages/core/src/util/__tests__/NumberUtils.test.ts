import { NumberUtils } from "../NumberUtils";

describe("isNonNegativeIntegerString", () => {
  test("with non negative integer string, should return true", () => {
    const input = "1";

    const output = NumberUtils.isNonNegativeIntegerString(input);

    expect(output).toBeTruthy();
  });

  test("with negative integer string, should return false", () => {
    const input = "-1";

    const output = NumberUtils.isNonNegativeIntegerString(input);

    expect(output).toBeFalsy();
  });

  test("with non negative float string, should return false", () => {
    const input = "1.1";

    const output = NumberUtils.isNonNegativeIntegerString(input);

    expect(output).toBeFalsy();
  });

  test("with non numeric string, should return false", () => {
    const input = "abc";

    const output = NumberUtils.isNonNegativeIntegerString(input);

    expect(output).toBeFalsy();
  });
});

describe("isIntegerString", () => {
  test("with non negative integer string, should return true", () => {
    const input = "1";

    const output = NumberUtils.isIntegerString(input);

    expect(output).toBeTruthy();
  });

  test("with negative integer string, should return true", () => {
    const input = "-1";

    const output = NumberUtils.isIntegerString(input);

    expect(output).toBeTruthy();
  });

  test("with non negative float string, should return false", () => {
    const input = "1.1";

    const output = NumberUtils.isIntegerString(input);

    expect(output).toBeFalsy();
  });

  test("with negative float string, should return false", () => {
    const input = "-1.1";

    const output = NumberUtils.isIntegerString(input);

    expect(output).toBeFalsy();
  });

  test("with non numeric string, should return false", () => {
    const input = "abc";

    const output = NumberUtils.isIntegerString(input);

    expect(output).toBeFalsy();
  });
});

describe("isFloatString", () => {
  test("with non negative integer string, should return true", () => {
    const input = "1";

    const output = NumberUtils.isFloatString(input);

    expect(output).toBeTruthy();
  });

  test("with negative integer string, should return true", () => {
    const input = "-1";

    const output = NumberUtils.isFloatString(input);

    expect(output).toBeTruthy();
  });

  test("with non negative float string, should return true", () => {
    const input = "1.1";

    const output = NumberUtils.isFloatString(input);

    expect(output).toBeTruthy();
  });

  test("with negative float string, should return true", () => {
    const input = "-1.1";

    const output = NumberUtils.isFloatString(input);

    expect(output).toBeTruthy();
  });

  test("with non numeric string, should return false", () => {
    const input = "abc";

    const output = NumberUtils.isFloatString(input);

    expect(output).toBeFalsy();
  });
});
