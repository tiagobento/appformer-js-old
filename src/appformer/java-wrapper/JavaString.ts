import JavaWrapper from "appformer/java-wrapper/JavaWrapper";

export default class JavaString implements JavaWrapper<string> {
  private readonly _fqcn = "java.lang.String";

  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public get(): string {
    return this._value;
  }
}
