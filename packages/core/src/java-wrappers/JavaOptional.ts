import { JavaWrapper } from "./JavaWrapper";
import { JavaType } from "./JavaType";

export class JavaOptional<T> extends JavaWrapper<T | undefined> {
  private readonly _fqcn = JavaType.OPTIONAL;

  private _value: T | undefined;

  constructor(value?: T) {
    super();
    this.set(value);
  }

  public get(): T {
    if (this._value === null || this._value === undefined) {
      throw new Error("No value present");
    }

    return this._value!;
  }

  public isPresent(): boolean {
    return this._value !== undefined;
  }

  public set(val: ((current: T | undefined) => T | undefined) | T | undefined): void {
    if (typeof val === "function") {
      this._value = val(this.get());
    } else {
      this._value = val;
    }
  }
}
