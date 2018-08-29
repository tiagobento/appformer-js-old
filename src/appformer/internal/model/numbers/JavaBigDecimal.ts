import { JavaBigNumber } from "./JavaBigNumber";
import BigNumber from "bignumber.js";

export class JavaBigDecimal extends JavaBigNumber {
  private readonly _fqcn = "java.math.BigDecimal";

  public from(asString: string): BigNumber {
    return new BigNumber(asString, 10);
  }
}
