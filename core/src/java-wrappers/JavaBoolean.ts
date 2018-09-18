import {JavaWrapper} from "./JavaWrapper";

export class JavaBoolean extends JavaWrapper<boolean> {
  private readonly _fqcn = "java.lang.Boolean";

  private readonly _value: boolean;

  constructor(value: boolean) {
    super();
    this._value = value;
  }

  public get(): boolean {
    return this._value;
  }
}
