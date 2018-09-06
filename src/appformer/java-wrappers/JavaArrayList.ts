import JavaCollection from "appformer/java-wrappers/JavaCollection";

export default class JavaArrayList<T> implements JavaCollection<T[]> {
  private readonly _fqcn = "java.util.ArrayList";

  private readonly _value: T[];

  constructor(value: T[]) {
    this._value = value;
  }

  public get(): T[] {
    return this._value;
  }
}
