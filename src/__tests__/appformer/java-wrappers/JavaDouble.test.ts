import JavaDouble from "appformer/java-wrappers/JavaDouble";

describe("get", () => {
  describe("with valid input", () => {
    test("positive float, should return same value as number", () => {
      const input = "12.24";

      const output = new JavaDouble(input).get();

      expect(output).toEqual(12.24);
    });

    test("negative float, should return same value as number", () => {
      const input = "-12.24";

      const output = new JavaDouble(input).get();

      expect(output).toEqual(-12.24);
    });

    test("positive integer, should return same value as number", () => {
      const input = "12";

      const output = new JavaDouble(input).get();

      expect(output).toEqual(12);
    });

    test("negative integer, should return same value as number", () => {
      const input = "-12";

      const output = new JavaDouble(input).get();

      expect(output).toEqual(-12);
    });
  });

  test("with invalid input string, should return NaN", () => {
    const input = "abc";

    const output = new JavaDouble(input).get();

    expect(output).toBeNaN();
  });

  describe("with input in the numeric bounds", () => {
    describe("minimum bound", () => {
      test("equals, should return same value as Number", () => {
        const input = `${-Number.MAX_VALUE}`;

        const output = new JavaDouble(input).get();

        expect(output).toEqual(-Number.MAX_VALUE);
      });

      test("less than, should return same value as Number", () => {
        const input = `${-Number.MAX_VALUE - 1}`;

        const output = new JavaDouble(input).get();

        expect(output).toEqual(-Number.MAX_VALUE - 1);
      });
    });

    describe("maximum bound", () => {
      test("equals, should return same value as Number", () => {
        const input = `${Number.MAX_VALUE}`;

        const output = new JavaDouble(input).get();

        expect(output).toEqual(Number.MAX_VALUE);
      });

      test("greater than, should return same value as Number", () => {
        const input = `${Number.MAX_VALUE + 1}`;

        const output = new JavaDouble(input).get();

        expect(output).toEqual(Number.MAX_VALUE + 1);
      });
    });
  });
});

describe("doubleValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1.1");

    const output = input.doubleValue();

    expect(output.get()).toBe(1.1);
  });
});

describe("intValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1");

    const output = input.intValue();

    expect(output.get()).toBe(1);
  });
});

describe("shortValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1");

    const output = input.shortValue();

    expect(output.get()).toBe(1);
  });
});

describe("byteValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1");

    const output = input.byteValue();

    expect(output.get()).toBe(1);
  });
});

describe("floatValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1.1");

    const output = input.floatValue();

    expect(output.get()).toBe(1.1);
  });
});

describe("longValue", () => {
  test("should convert successfully", () => {
    const input = new JavaDouble("1");

    const output = input.longValue();

    expect(output.get().toNumber()).toBe(1);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaDouble("1") as any)._fqcn;

    expect(fqcn).toBe("java.lang.Double");
  });
});
