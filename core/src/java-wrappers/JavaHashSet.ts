import { JavaCollection } from "./JavaCollection";

export class JavaHashSet<T> extends JavaCollection<Set<T>> {
  private readonly _fqcn = "java.util.HashSet";

  private readonly _value: Set<T>;

  constructor(value: Set<T>) {
    super();
    this._value = value;
  }

  public get(): Set<T> {
    return this._value;
  }
}
