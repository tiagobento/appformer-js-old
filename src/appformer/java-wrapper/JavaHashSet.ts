import JavaCollection from "appformer/java-wrapper/JavaCollection";

export default class JavaHashSet implements JavaCollection<Set<any>> {
  private readonly _fqcn = "java.util.HashSet";

  private readonly _value: Set<any>;

  constructor(value: Set<any>) {
    this._value = value;
  }

  public get(): Set<any> {
    return this._value;
  }
}
