import JavaLong from "appformer/java-wrapper/JavaLong";
import BigNumber from "bignumber.js";

describe("get", () => {
  describe("with valid input", () => {
    test("positive integer, should return same value as number", () => {
      const input = "12";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("negative integer, should return same value as number", () => {
      const input = "-12";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });
  });

  test("with invalid textual string, should return NaN", () => {
    const input = "abc";

    const output = new JavaLong(input).get();

    expect(output).toEqual(new BigNumber(NaN));
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as number", () => {
        const input = `${JavaLong.MIN_VALUE}`;

        const output = new JavaLong(input).get();

        expect(output).toEqual(new BigNumber(`${JavaLong.MIN_VALUE}`));
      });

      test("less than, should return NaN", () => {
        const input = new BigNumber(`${JavaLong.MIN_VALUE}`).minus(1, 10);

        const output = new JavaLong(input.toString(10)).get();

        expect(output).toEqual(new BigNumber(NaN));
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as number", () => {
        const input = `${JavaLong.MAX_VALUE}`;

        const output = new JavaLong(input).get();

        expect(output).toEqual(new BigNumber(`${JavaLong.MAX_VALUE}`));
      });

      test("greater than, should return NaN", () => {
        const input = new BigNumber(`${JavaLong.MAX_VALUE}`).plus(1, 10);

        const output = new JavaLong(input.toString(10)).get();

        expect(output).toEqual(new BigNumber(NaN));
      });
    });
  });

  describe("with float string", () => {
    test("positive with decimal closest to 0, should return truncated value as Number", () => {
      const input = "12.1";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("positive with decimal exactly between 0 and 1, should return truncated value as Number", () => {
      const input = "12.5";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("positive with decimal closest to 1, should return truncated value as Number", () => {
      const input = "12.9";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("negative with decimal closest to 0, should return truncated value as Number", () => {
      const input = "-12.1";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });

    test("negative with decimal exactly between 0 and 1, should return truncated value as Number", () => {
      const input = "-12.5";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });

    test("negative with decimal closest to 1, should return truncated value as Number", () => {
      const input = "-12.9";

      const output = new JavaLong(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaLong("1") as any)._fqcn;

    expect(fqcn).toBe("java.lang.Long");
  });
});
