import { JavaWrapper } from "./JavaWrapper";
import { instanceOfMap } from "../util/TypeUtils";

export class JavaHashMap<T, U> extends JavaWrapper<Map<T, U>> {
  private readonly _fqcn = "java.util.HashMap";

  private _value: Map<T, U>;

  constructor(value: Map<T, U>) {
    super();
    this.set(value);
  }

  public get(): Map<T, U> {
    return this._value;
  }

  public set(val: ((current: Map<T, U>) => Map<T, U>) | Map<T, U>): void {
    if (instanceOfMap(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
