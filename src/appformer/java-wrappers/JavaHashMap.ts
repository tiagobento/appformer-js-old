import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

export default class JavaHashMap<T, U> implements JavaWrapper<Map<T, U>> {
  private readonly _fqcn = "java.util.HashMap";

  private readonly _value: Map<any, any>;

  constructor(value: Map<T, U>) {
    this._value = value;
  }

  public get(): Map<T, U> {
    return this._value;
  }
}
