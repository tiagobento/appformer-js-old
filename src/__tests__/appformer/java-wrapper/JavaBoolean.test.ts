import JavaBoolean from "appformer/java-wrapper/JavaBoolean";

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

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaBoolean(true) as any)._fqcn;

    expect(fqcn).toBe("java.lang.Boolean");
  });
});
