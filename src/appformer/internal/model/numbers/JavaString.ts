import { JavaWrapper } from "./JavaWrapper";

export class JavaString implements JavaWrapper<string> {
  private readonly _fqcn = "java.lang.String";

  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public get(): string {
    return this._value;
  }
}
