import {JavaArrayList} from "java-wrappers/JavaArrayList";

describe("get", () => {
  test("with populated array, returns the same array", () => {
    const input = ["foo", "bar", "foo2"];

    const output = new JavaArrayList(input).get();

    expect(output).toEqual(["foo", "bar", "foo2"]);
  });

  test("with empty array, returns the same array", () => {
    const input = [] as any[];

    const output = new JavaArrayList(input).get();

    expect(output).toEqual([]);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaArrayList(["1", "2"]) as any)._fqcn;

    expect(fqcn).toBe("java.util.ArrayList");
  });
});
