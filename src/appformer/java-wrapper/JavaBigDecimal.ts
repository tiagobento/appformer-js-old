import BigNumber from "bignumber.js";
import JavaBigNumber from "appformer/java-wrapper/JavaBigNumber";

export default class JavaBigDecimal extends JavaBigNumber {
  private readonly _fqcn = "java.math.BigDecimal";

  public from(asString: string): BigNumber {
    return new BigNumber(asString, 10);
  }

  public isInRange(n: BigNumber): boolean {
    return true; // arbitrary precision
  }
}
