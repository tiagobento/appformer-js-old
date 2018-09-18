import { JavaCollection } from "./JavaCollection";
import { instanceOfArray } from "../util/TypeUtils";

export class JavaArrayList<T> extends JavaCollection<T[]> {
  private readonly _fqcn = "java.util.ArrayList";

  private _value: T[];

  constructor(value: T[]) {
    super();
    this.set(value);
  }

  public get(): T[] {
    return this._value;
  }

  public set(val: ((current: T[]) => T[]) | T[]): void {
    if (instanceOfArray(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
