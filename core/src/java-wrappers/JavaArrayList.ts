import { JavaCollection } from "./JavaCollection";

export class JavaArrayList<T> extends JavaCollection<T[]> {
  private readonly _fqcn = "java.util.ArrayList";

  private readonly _value: T[];

  constructor(value: T[]) {
    super();
    this._value = value;
  }

  public get(): T[] {
    return this._value;
  }
}
