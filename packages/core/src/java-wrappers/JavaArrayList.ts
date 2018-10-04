import { JavaCollection } from "./JavaCollection";
import { instanceOfArray } from "../util/TypeUtils";
import { JavaType } from "./JavaType";

export class JavaArrayList<T> extends JavaCollection<T[]> {
  private readonly _fqcn = JavaType.ARRAY_LIST;

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
