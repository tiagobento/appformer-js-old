import { JavaWrapper } from "./JavaWrapper";

export abstract class NumberWrapper extends JavaWrapper<number> {
  private _value: number;

  public constructor(value: string) {
    super();
    const valueAsNumber = this.from(value);

    this._value = this.applyNumericRange(valueAsNumber);
  }

  public get(): number {
    return this._value;
  }

  public set(value: number | ((current: number) => number)): void {
    if (typeof value === "number") {
      this._value = this.applyNumericRange(value);
    } else {
      this._value = this.applyNumericRange(value(this.get()));
    }
  }

  protected abstract from(asString: string): number;

  protected abstract isInRange(n: number): boolean;

  private applyNumericRange(n: number): number {
    if (!this.isInRange(n)) {
      return Number.NaN;
    }
    return n;
  }
}
