import {JavaBigDecimal} from "java-wrappers/JavaBigDecimal";
import {BigNumber} from "bignumber.js";

describe("get", () => {
  describe("with valid input", () => {
    test("positive float, should return same value as BigNumber", () => {
      const input = "12.92";

      const output = new JavaBigDecimal(input).get();

      expect(output).toEqual(new BigNumber(input));
    });

    test("negative float, should return same value as BigNumber", () => {
      const input = "-12.92";

      const output = new JavaBigDecimal(input).get();

      expect(output).toEqual(new BigNumber(input));
    });

    test("positive integer, should return same value as BigNumber", () => {
      const input = "12";

      const output = new JavaBigDecimal(input).get();

      expect(output).toEqual(new BigNumber(input));
    });

    test("negative integer, should return same value as BigNumber", () => {
      const input = "-12";

      const output = new JavaBigDecimal(input).get();

      expect(output).toEqual(new BigNumber(input));
    });
  });

  test("with invalid textual string, should return NaN", () => {
    const input = "abc";

    const output = new JavaBigDecimal(input).get();

    expect(output).toEqual(new BigNumber(input));
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = new BigNumber(-Number.MAX_VALUE);

        const output = new JavaBigDecimal(input.toString(10)).get();

        expect(output).toEqual(input);
      });

      test("less than, should return same value as BigNumber", () => {
        const input = new BigNumber(-Number.MAX_VALUE).minus(1, 10);

        const output = new JavaBigDecimal(input.toString(10)).get();

        expect(output).toEqual(input);
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as BigNumber", () => {
        const input = new BigNumber(Number.MAX_VALUE);

        const output = new JavaBigDecimal(input.toString(10)).get();

        expect(output).toEqual(input);
      });

      test("greater than, should return same value as BigNumber", () => {
        const input = new BigNumber(Number.MAX_VALUE).plus(1, 10);

        const output = new JavaBigDecimal(input.toString(10)).get();

        expect(output).toEqual(input);
      });
    });
  });
});

describe("doubleValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1.2");

    const output = input.doubleValue();

    expect(output.get()).toBe(1.2);
  });
});

describe("intValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1");

    const output = input.intValue();

    expect(output.get()).toBe(1);
  });
});

describe("shortValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1");

    const output = input.shortValue();

    expect(output.get()).toBe(1);
  });
});

describe("byteValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1");

    const output = input.byteValue();

    expect(output.get()).toBe(1);
  });
});

describe("floatValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1.1");

    const output = input.floatValue();

    expect(output.get()).toBe(1.1);
  });
});

describe("longValue", () => {
  test("should convert successfully", () => {
    const input = new JavaBigDecimal("1");

    const output = input.longValue();

    expect(output.get().toNumber()).toBe(1);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaBigDecimal("1") as any)._fqcn;

    expect(fqcn).toBe("java.math.BigDecimal");
  });
});
