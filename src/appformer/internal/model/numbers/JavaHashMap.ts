import { JavaWrapper } from "./JavaWrapper";

export class JavaHashMap implements JavaWrapper<Map<any, any>> {
  private readonly _fqcn = "java.util.HashMap";

  private readonly _value: Map<any, any>;

  constructor(value: Map<any, any>) {
    this._value = value;
  }

  public get(): Map<any, any> {
    return this._value;
  }
}
