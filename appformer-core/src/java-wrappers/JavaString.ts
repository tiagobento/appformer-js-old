import JavaWrapper from "java-wrappers/JavaWrapper";

export default class JavaString extends JavaWrapper<string> {
  private readonly _fqcn = "java.lang.String";

  private readonly _value: string;

  constructor(value: string) {
    super();
    this._value = value;
  }

  public get(): string {
    return this._value;
  }
}
