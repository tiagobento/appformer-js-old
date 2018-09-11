import JavaOptional from "appformer/java-wrappers/JavaOptional";

describe("get", () => {
  describe("with valid input", () => {
    test("defined element, should return same element", () => {
      const input = "foo";

      const output = new JavaOptional<string>(input).get();

      expect(output).toBe("foo");
    });

    test("undefined element, should return undefined", () => {
      const input = undefined;

      const output = new JavaOptional<string>(input).get();

      expect(output).toBeUndefined();
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaOptional<string>("foo") as any)._fqcn;

    expect(fqcn).toBe("java.util.Optional");
  });
});
