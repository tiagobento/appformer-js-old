import { JavaHashSet } from "../JavaHashSet";

describe("get", () => {
  test("with populated set, returns the same set", () => {
    const input = new Set(["foo", "bar", "foo2"]);

    const output = new JavaHashSet(input).get();

    expect(output).toEqual(new Set(["foo", "bar", "foo2"]));
  });

  test("with empty set, returns the same set", () => {
    const input = new Set();

    const output = new JavaHashSet(input).get();

    expect(output).toEqual(new Set());
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaHashSet(new Set(["1", "2"])) as any)._fqcn;

    expect(fqcn).toBe("java.util.HashSet");
  });
});
