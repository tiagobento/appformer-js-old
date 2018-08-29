import { JavaWrapper } from "./JavaWrapper";

export abstract class JavaNumber implements JavaWrapper<number> {
  private readonly _value: number;

  public constructor(value: string) {
    this._value = this.from(value);
  }

  public get(): number {
    return this._value;
  }

  public abstract from(asString: string): number;
}
