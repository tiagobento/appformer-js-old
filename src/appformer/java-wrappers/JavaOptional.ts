import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

export default class JavaOptional<T> implements JavaWrapper<T | undefined> {
  private readonly _fqcn = "java.util.Optional";

  private readonly _value: T | undefined;

  constructor(value?: T) {
    this._value = value;
  }

  public get(): T | undefined {
    return this._value;
  }
}
