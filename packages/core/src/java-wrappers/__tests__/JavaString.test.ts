import { JavaString } from "../JavaString";
import { JavaType } from "../JavaType";

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

describe("set", () => {
  test("with direct value, should set", () => {
    const input = new JavaString("foo");
    expect(input.get()).toBe("foo");

    input.set("bar");

    expect(input.get()).toBe("bar");
  });

  test("with value from function, should set", () => {
    const input = new JavaString("foo");
    expect(input.get()).toBe("foo");

    input.set(cur => cur + "bar");

    expect(input.get()).toBe("foobar");
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaString("foo") as any)._fqcn;

    expect(fqcn).toBe(JavaType.STRING);
  });
});
