import { JavaDate } from "../JavaDate";

describe("get", () => {
  test("with date, should return same value as Date", () => {
    const input = new Date();

    const output = new JavaDate(input).get();

    expect(output).toEqual(input);
  });
});

describe("set", () => {
  test("with direct value, should set", () => {
    const firstDate = new Date();

    const input = new JavaDate(firstDate);
    expect(input.get()).toEqual(firstDate);

    const secondDate = new Date();
    input.set(secondDate);

    expect(input.get()).toEqual(secondDate);
  });

  test("with value from function, should set", () => {
    const firstDate = new Date();

    const input = new JavaDate(firstDate);
    expect(input.get()).toEqual(firstDate);

    input.set(cur => {
      const newDate = new Date(cur.getUTCMilliseconds());
      newDate.setHours(cur.getHours() + 1);
      return newDate;
    });

    const expectedDate = new Date(firstDate.getUTCMilliseconds());
    expectedDate.setHours(firstDate.getHours() + 1);
    expect(input.get()).toEqual(expectedDate);
  });
});

describe("_fqcn", () => {
  test("must be the same than in Java", () => {
    const fqcn = (new JavaDate(new Date()) as any)._fqcn;

    expect(fqcn).toBe("java.util.Date");
  });
});
