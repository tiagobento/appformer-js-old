import BigNumber from "bignumber.js";
import JavaWrapper from "./JavaWrapper";

export default abstract class JavaBigNumber implements JavaWrapper<BigNumber> {
  private readonly _value: BigNumber;

  public constructor(value: string) {
    this._value = this.from(value);
  }

  public get(): BigNumber {
    return this._value;
  }

  public abstract from(asString: string): BigNumber;
}
