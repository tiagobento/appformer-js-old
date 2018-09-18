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

describe("set", () => {
  test("with direct value, should set", () => {
    const input = new JavaHashMap(new Map([["k1", "v1"]]));
    expect(input.get()).toEqual(new Map([["k1", "v1"]]));

    input.set(new Map([["k2", "v2"]]));

    expect(input.get()).toEqual(new Map([["k2", "v2"]]));
  });

  test("with value from function, should set", () => {
    const input = new JavaHashMap(new Map([["k1", "v1"]]));
    expect(input.get()).toEqual(new Map([["k1", "v1"]]));

    input.set(cur => {
      const newMap = new Map(cur);
      newMap.set("k2", "v2");
      return newMap;
    });

    expect(input.get()).toEqual(new Map([["k1", "v1"], ["k2", "v2"]]));
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaHashMap(new Map([["foo1", "bar1"]])) as any)._fqcn;

    expect(fqcn).toBe("java.util.HashMap");
  });
});
