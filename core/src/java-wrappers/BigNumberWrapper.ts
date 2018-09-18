import { BigNumber } from "bignumber.js";
import { JavaWrapper } from "./JavaWrapper";

export abstract class BigNumberWrapper extends JavaWrapper<BigNumber> {
  private _value: BigNumber;

  public constructor(value: string) {
    super();
    const valueAsNumber = this.from(value);

    this._value = this.applyNumericRange(valueAsNumber);
  }

  public get(): BigNumber {
    return this._value;
  }

  public set(value: BigNumber | ((current: BigNumber) => BigNumber)): void {
    if (value instanceof BigNumber) {
      this._value = this.applyNumericRange(value);
    } else {
      this._value = this.applyNumericRange(value(this.get()));
    }
  }

  protected abstract from(asString: string): BigNumber;

  protected abstract isInRange(n: BigNumber): boolean;

  private applyNumericRange(value: BigNumber) {
    if (!this.isInRange(value)) {
      return new BigNumber(NaN);
    }
    return value;
  }
}
