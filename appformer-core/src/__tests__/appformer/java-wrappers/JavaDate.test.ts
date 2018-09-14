import {JavaDate} from "java-wrappers/JavaDate";

describe("get", () => {
  test("with date, should return same value as Date", () => {
    const input = new Date();

    const output = new JavaDate(input).get();

    expect(output).toEqual(input);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaDate(new Date()) as any)._fqcn;

    expect(fqcn).toBe("java.util.Date");
  });
});
