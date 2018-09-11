import JavaFloat from "appformer/java-wrappers/JavaFloat";

describe("get", () => {
  describe("with valid input", () => {
    test("positive float, should return same value as BigNumber", () => {
      const input = "12.92";

      const output = new JavaFloat(input).get();

      expect(output).toEqual(12.92);
    });

    test("negative float, should return same value as BigNumber", () => {
      const input = "-12.92";

      const output = new JavaFloat(input).get();

      expect(output).toEqual(-12.92);
    });

    test("positive integer, should return same value as BigNumber", () => {
      const input = "12";

      const output = new JavaFloat(input).get();

      expect(output).toEqual(12);
    });

    test("negative integer, should return same value as BigNumber", () => {
      const input = "-12";

      const output = new JavaFloat(input).get();

      expect(output).toEqual(-12);
    });
  });

  test("with invalid textual string, should return NaN", () => {
    const input = "abc";

    const output = new JavaFloat(input).get();

    expect(output).toBeNaN();
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = `${JavaFloat.MIN_VALUE}`;

        const output = new JavaFloat(input).get();

        expect(output).toEqual(JavaFloat.MIN_VALUE);
      });

      test("less than, should return NaN", () => {
        const input = `${JavaFloat.MIN_VALUE - 1e23}`; // smaller value inside float's precision

        const output = new JavaFloat(input).get();

        expect(output).toBeNaN();
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = `${JavaFloat.MAX_VALUE}`;

        const output = new JavaFloat(input).get();

        expect(output).toEqual(JavaFloat.MAX_VALUE);
      });

      test("greater than, should return same value as BigNumber", () => {
        const input = `${JavaFloat.MAX_VALUE + 1e23}`; // smaller value inside float's precision

        const output = new JavaFloat(input).get();

        expect(output).toEqual(NaN);
      });
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaFloat("1") as any)._fqcn;

    expect(fqcn).toBe("java.lang.Float");
  });
});
