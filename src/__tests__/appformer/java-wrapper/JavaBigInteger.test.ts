import BigNumber from "bignumber.js";
import JavaBigInteger from "appformer/java-wrapper/JavaBigInteger";

describe("get", () => {
  describe("with valid input", () => {
    test("positive integer, should return same value as BigNumber", () => {
      const input = "12";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber(input));
    });

    test("negative integer, should return same value as BigNumber", () => {
      const input = "-12";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber(input));
    });
  });

  test("with invalid textual string, should return NaN", () => {
    const input = "abc";

    const output = new JavaBigInteger(input).get();

    expect(output).toEqual(new BigNumber(input));
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = new BigNumber(-Number.MAX_VALUE);

        const output = new JavaBigInteger(input.toString(10)).get();

        expect(output).toEqual(input);
      });

      test("less than, should return same value as BigNumber", () => {
        const input = new BigNumber(-Number.MAX_VALUE).minus(1, 10);

        const output = new JavaBigInteger(input.toString(10)).get();

        expect(output).toEqual(input);
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = new BigNumber(Number.MAX_VALUE);

        const output = new JavaBigInteger(input.toString(10)).get();

        expect(output).toEqual(input);
      });

      test("greater than, should return same value as BigNumber", () => {
        const input = new BigNumber(Number.MAX_VALUE).plus(1, 10);

        const output = new JavaBigInteger(input.toString(10)).get();

        expect(output).toEqual(input);
      });
    });
  });

  describe("with float string", () => {
    test("positive with decimal closest to 0, should return truncated value as BigNumber", () => {
      const input = "12.1";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("positive with decimal exactly between 0 and 1, should return truncated value as BigNumber", () => {
      const input = "12.5";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("positive with decimal closest to 1, should return truncated value as BigNumber", () => {
      const input = "12.9";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("12"));
    });

    test("negative with decimal closest to 0, should return truncated value as BigNumber", () => {
      const input = "-12.1";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });

    test("negative with decimal exactly between 0 and 1, should return truncated value as BigNumber", () => {
      const input = "-12.5";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });

    test("negative with decimal closest to 1, should return truncated value as BigNumber", () => {
      const input = "-12.9";

      const output = new JavaBigInteger(input).get();

      expect(output).toEqual(new BigNumber("-12"));
    });
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaBigInteger("1") as any)._fqcn;

    expect(fqcn).toBe("java.math.BigInteger");
  });
});
