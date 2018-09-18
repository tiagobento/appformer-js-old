import { JavaHashMap } from "../JavaHashMap";

describe("get", () => {
  test("with populated map, returns the same map", () => {
    const input = new Map([["foo1", "bar1"], ["foo2", "bar2"]]);

    const output = new JavaHashMap(input).get();

    expect(output).toEqual(new Map([["foo1", "bar1"], ["foo2", "bar2"]]));
  });

  test("with empty map, returns the same map", () => {
    const input = new Map();

    const output = new JavaHashMap(input).get();

    expect(output).toEqual(new Map());
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaHashMap(new Map([["foo1", "bar1"]])) as any)._fqcn;

    expect(fqcn).toBe("java.util.HashMap");
  });
});
