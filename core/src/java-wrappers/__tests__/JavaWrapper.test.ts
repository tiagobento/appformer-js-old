import { JavaWrapper } from "../JavaWrapper";

describe("extendsJavaWrapper", () => {
  test("with class extending java wrapper, should return true", () => {
    const input = new MyNumberType(1);

    const output = JavaWrapper.extendsJavaWrapper(input);

    expect(output).toBeTruthy();
  });

  test("with class not extending java wrapper, should return false", () => {
    const input = {
      foo: "bar"
    };

    const output = JavaWrapper.extendsJavaWrapper(input);

    expect(output).toBeFalsy();
  });

  class MyNumberType extends JavaWrapper<number> {
    private _value: number;

    constructor(value: number) {
      super();
      this._value = value;
    }

    public get(): number {
      return this._value;
    }
  }
});
