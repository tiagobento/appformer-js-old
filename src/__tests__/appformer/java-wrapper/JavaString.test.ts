import JavaString from "appformer/java-wrappers/JavaString";

describe("get", () => {
  describe("with valid input", () => {
    test("non-empty string, should return same string", () => {
      const input = "foo";

      const output = new JavaString(input).get();

      expect(output).toBe("foo");
    });

    test("empty string, should return same string", () => {
      const input = "";

      const output = new JavaString(input).get();

      expect(output).toBe("");
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaString("foo") as any)._fqcn;

    expect(fqcn).toBe("java.lang.String");
  });
});
