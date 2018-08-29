import { BigNumber } from "bignumber.js";
import { JavaBigNumber } from "./JavaBigNumber";

export class JavaBigInteger extends JavaBigNumber {
  private readonly _fqcn = "java.math.BigInteger";

  public from(asString: string): BigNumber {
    return new BigNumber(asString, 10);
  }
}
