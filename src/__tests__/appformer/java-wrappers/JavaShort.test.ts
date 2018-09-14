import JavaShort from "appformer/java-wrappers/JavaShort";

describe("get", () => {
  describe("with valid input", () => {
    test("positive integer, should return same value as number", () => {
      const input = "12";

      const output = new JavaShort(input).get();

      expect(output).toEqual(12);
    });

    test("negative integer, should return same value as number", () => {
      const input = "-12";

      const output = new JavaShort(input).get();

      expect(output).toEqual(-12);
    });
  });

  test("with invalid textual string, should return NaN", () => {
    const input = "abc";

    const output = new JavaShort(input).get();

    expect(output).toBeNaN();
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as number", () => {
        const input = `${JavaShort.MIN_VALUE}`;

        const output = new JavaShort(input).get();

        expect(output).toEqual(JavaShort.MIN_VALUE);
      });

      test("less than, should return NaN", () => {
        const input = `${JavaShort.MIN_VALUE - 1}`;

        const output = new JavaShort(input).get();

        expect(output).toEqual(NaN);
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as number", () => {
        const input = `${JavaShort.MAX_VALUE}`;

        const output = new JavaShort(input).get();

        expect(output).toEqual(JavaShort.MAX_VALUE);
      });

      test("greater than, should return NaN", () => {
        const input = `${JavaShort.MAX_VALUE + 1}`;

        const output = new JavaShort(input).get();

        expect(output).toEqual(NaN);
      });
    });
  });

  describe("with float string", () => {
    test("positive with decimal closest to 0, should return truncated value as Number", () => {
      const input = "12.1";

      const output = new JavaShort(input).get();

      expect(output).toEqual(12);
    });

    test("positive with decimal exactly between 0 and 1, should return truncated value as Number", () => {
      const input = "12.5";

      const output = new JavaShort(input).get();

      expect(output).toEqual(12);
    });

    test("positive with decimal closest to 1, should return truncated value as Number", () => {
      const input = "12.9";

      const output = new JavaShort(input).get();

      expect(output).toEqual(12);
    });

    test("negative with decimal closest to 0, should return truncated value as Number", () => {
      const input = "-12.1";

      const output = new JavaShort(input).get();

      expect(output).toEqual(-12);
    });

    test("negative with decimal exactly between 0 and 1, should return truncated value as Number", () => {
      const input = "-12.5";

      const output = new JavaShort(input).get();

      expect(output).toEqual(-12);
    });

    test("negative with decimal closest to 1, should return truncated value as Number", () => {
      const input = "-12.9";

      const output = new JavaShort(input).get();

      expect(output).toEqual(-12);
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaShort("1") as any)._fqcn;

    expect(fqcn).toBe("java.lang.Short");
  });
});