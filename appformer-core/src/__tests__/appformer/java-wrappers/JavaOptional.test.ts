import {JavaOptional} from "java-wrappers/JavaOptional";

describe("get", () => {
  describe("with valid input", () => {
    test("defined element, should return same element", () => {
      const input = "foo";

      const output = new JavaOptional<string>(input).get();

      expect(output).toBe("foo");
    });

    test("undefined element, should throw error", () => {
      const input = undefined;

      const optional = new JavaOptional<string>(input);

      expect(() => optional.get()).toThrowError();
    });
  });
});

describe("ifPresent", () => {
  test("with defined element, should return true", () => {
    const input = new JavaOptional<string>("str");

    const output = input.isPresent();

    expect(output).toBeTruthy();
  });

  test("with undefined element, should return true", () => {
    const input = new JavaOptional<string>(undefined);

    const output = input.isPresent();

    expect(output).toBeFalsy();
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaOptional<string>("foo") as any)._fqcn;

    expect(fqcn).toBe("java.util.Optional");
  });
});
