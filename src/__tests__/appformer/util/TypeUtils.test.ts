import { isArray, isBoolean, isDate, isMap, isSet, isString } from "appformer/util/TypeUtils";

describe("isString", () => {
  test("with direct assigned string, should return true", () => {
    const input = "str";

    const output = isString(input);

    expect(output).toBeTruthy();
  });

  test("with string created via constructor, should return true", () => {
    const input = String("str");

    const output = isString(input);

    expect(output).toBeTruthy();
  });

  test("with non-string input, should return false", () => {
    const input = 1;

    const output = isString(input);

    expect(output).toBeFalsy();
  });
});

describe("isArray", () => {
  test("with direct assigned array, should return true", () => {
    const input = [1, 2, 3];

    const output = isArray(input);

    expect(output).toBeTruthy();
  });

  test("with array created via constructor, should return true", () => {
    const input = new Array(1, 2, 3);

    const output = isArray(input);

    expect(output).toBeTruthy();
  });

  test("with non-array input, should return false", () => {
    const input = 1;

    const output = isArray(input);

    expect(output).toBeFalsy();
  });
});

describe("isSet", () => {
  test("with set created via constructor, should return true", () => {
    const input = new Set([1, 2, 3]);

    const output = isSet(input);

    expect(output).toBeTruthy();
  });

  test("with non-set input, should return false", () => {
    const input = 1;

    const output = isSet(input);

    expect(output).toBeFalsy();
  });
});

describe("isMap", () => {
  test("with map created via constructor, should return true", () => {
    const input = new Map([[1, 2]]);

    const output = isMap(input);

    expect(output).toBeTruthy();
  });

  test("with non-set input, should return false", () => {
    const input = 1;

    const output = isMap(input);

    expect(output).toBeFalsy();
  });
});

describe("isBoolean", () => {
  test("with direct assigned boolean, should return true", () => {
    const input = false;

    const output = isBoolean(input);

    expect(output).toBeTruthy();
  });

  test("with boolean created via constructor, should return true", () => {
    const input = Boolean(false);

    const output = isBoolean(input);

    expect(output).toBeTruthy();
  });

  test("with non-boolean input, should return false", () => {
    const input = 1;

    const output = isBoolean(input);

    expect(output).toBeFalsy();
  });
});

describe("isDate", () => {
  test("with date created via constructor, should return true", () => {
    const input = new Date();

    const output = isDate(input);

    expect(output).toBeTruthy();
  });

  test("with non-date input, should return false", () => {
    const input = 1;

    const output = isDate(input);

    expect(output).toBeFalsy();
  });
});
