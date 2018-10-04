import { JavaCollection } from "./JavaCollection";
import { instanceOfSet } from "../util/TypeUtils";
import { JavaType } from "./JavaType";

export class JavaHashSet<T> extends JavaCollection<Set<T>> {
  private readonly _fqcn = JavaType.HASH_SET;

  private _value: Set<T>;

  constructor(value: Set<T>) {
    super();
    this.set(value);
  }

  public get(): Set<T> {
    return this._value;
  }

  public set(val: ((current: Set<T>) => Set<T>) | Set<T>): void {
    if (instanceOfSet(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
