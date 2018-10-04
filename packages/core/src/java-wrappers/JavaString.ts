import { JavaWrapper } from "./JavaWrapper";
import { instanceOfString } from "../util/TypeUtils";
import { JavaType } from "./JavaType";

export class JavaString extends JavaWrapper<string> {
  private readonly _fqcn = JavaType.STRING;

  private _value: string;

  constructor(value: string) {
    super();
    this.set(value);
  }

  public get(): string {
    return this._value;
  }

  public set(val: ((current: string) => string) | string): void {
    if (instanceOfString(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
