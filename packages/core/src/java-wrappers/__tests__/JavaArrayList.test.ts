import { JavaArrayList } from "../JavaArrayList";
import { JavaType } from "../JavaType";

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

describe("set", () => {
  test("with direct value, should set", () => {
    const input = new JavaArrayList(["foo", "bar"]);
    expect(input.get()).toStrictEqual(["foo", "bar"]);

    input.set(["foo"]);
    expect(input.get()).toStrictEqual(["foo"]);
  });

  test("with value from function, should set", () => {
    const input = new JavaArrayList(["foo", "bar"]);
    expect(input.get()).toStrictEqual(["foo", "bar"]);

    input.set(curr => {
      const newArr = new Array(...curr);
      newArr.push("newfoo");
      return newArr;
    });

    expect(input.get()).toStrictEqual(["foo", "bar", "newfoo"]);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaArrayList(["1", "2"]) as any)._fqcn;

    expect(fqcn).toBe(JavaType.ARRAY_LIST);
  });
});
