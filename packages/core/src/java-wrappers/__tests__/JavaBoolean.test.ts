import { JavaBoolean } from "../JavaBoolean";
import { JavaType } from "../JavaType";

describe("get", () => {
  describe("with valid input", () => {
    test("true, should return boolean true", () => {
      const input = true;

      const output = new JavaBoolean(input).get();

      expect(output).toBeTruthy();
    });

    test("false, should return boolean false", () => {
      const input = false;

      const output = new JavaBoolean(input).get();

      expect(output).toBeFalsy();
    });
  });
});

describe("set", () => {
  test("with direct value, should set", () => {
    const input = new JavaBoolean(false);
    expect(input.get()).toBeFalsy();

    input.set(true);

    expect(input.get()).toBeTruthy();
  });

  test("with value from function, should set", () => {
    const input = new JavaBoolean(false);
    expect(input.get()).toBeFalsy();

    input.set(cur => !cur);

    expect(input.get()).toBeTruthy();
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaBoolean(true) as any)._fqcn;

    expect(fqcn).toBe(JavaType.BOOLEAN);
  });
});
