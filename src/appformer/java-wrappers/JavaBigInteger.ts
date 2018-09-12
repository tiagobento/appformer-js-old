import { BigNumber } from "bignumber.js";
import JavaBigNumber from "appformer/java-wrappers/JavaBigNumber";

export default class JavaBigInteger extends JavaBigNumber {
  private readonly _fqcn = "java.math.BigInteger";

  public from(asString: string): BigNumber {
    const bigNumber = new BigNumber(asString, 10);
    if (bigNumber.isInteger()) {
      return bigNumber;
    }

    // truncates decimal part (like TS's Number type)
    return bigNumber.integerValue(BigNumber.ROUND_DOWN);
  }

  protected isInRange(n: BigNumber): boolean {
    return true; // arbitrary precision
  }
}
