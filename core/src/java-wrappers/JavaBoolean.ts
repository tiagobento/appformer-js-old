import { JavaWrapper } from "./JavaWrapper";
import { instanceOfBoolean } from "../util/TypeUtils";

export class JavaBoolean extends JavaWrapper<boolean> {
  private readonly _fqcn = "java.lang.Boolean";

  private _value: boolean;

  constructor(value: boolean) {
    super();
    this.set(value);
  }

  public get(): boolean {
    return this._value;
  }

  public set(val: ((current: boolean) => boolean) | boolean): void {
    if (instanceOfBoolean(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
