import BigNumber from "bignumber.js";
import JavaWrapper from "java-wrappers/JavaWrapper";

export default abstract class BigNumberWrapper extends JavaWrapper<BigNumber> {
  private readonly _value: BigNumber;

  public constructor(value: string) {
    super();
    const valueAsNumber = this.from(value);

    if (!this.isInRange(valueAsNumber)) {
      this._value = new BigNumber(NaN);
    } else {
      this._value = valueAsNumber;
    }
  }

  public get(): BigNumber {
    return this._value;
  }

  protected abstract from(asString: string): BigNumber;

  protected abstract isInRange(n: BigNumber): boolean;
}
