import { BigNumber } from "bignumber.js";
import JavaBigNumber from "appformer/java-wrapper/JavaBigNumber";

export default class JavaLong extends JavaBigNumber {
  private readonly _fqcn = "java.lang.Long";

  public from(asString: string): BigNumber {
    // simulate Java's Long number range
    const BN = BigNumber.clone({ RANGE: 18, DECIMAL_PLACES: 0 });
    return new BN(asString);
  }
}
