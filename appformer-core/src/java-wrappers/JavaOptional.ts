import JavaWrapper from "java-wrappers/JavaWrapper";

export default class JavaOptional<T> extends JavaWrapper<T | undefined> {
  private readonly _fqcn = "java.util.Optional";

  private readonly _value: T | undefined;

  constructor(value?: T) {
    super();
    this._value = value;
  }

  public get(): T {
    if (!this._value) {
      throw new Error("No value present");
    }

    return this._value!;
  }

  public isPresent(): boolean {
    return this._value !== undefined;
  }
}
