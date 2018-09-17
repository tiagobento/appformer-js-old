import {JavaWrapper} from "./JavaWrapper";

export class JavaHashMap<T, U> extends JavaWrapper<Map<T, U>> {
  private readonly _fqcn = "java.util.HashMap";

  private readonly _value: Map<T, U>;

  constructor(value: Map<T, U>) {
    super();
    this._value = value;
  }

  public get(): Map<T, U> {
    return this._value;
  }
}
