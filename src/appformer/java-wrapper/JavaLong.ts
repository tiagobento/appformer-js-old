import { BigNumber } from "bignumber.js";
import JavaBigNumber from "appformer/java-wrapper/JavaBigNumber";

export default class JavaLong extends JavaBigNumber {
  public static readonly MIN_VALUE = new BigNumber("-9223372036854775808", 10);
  public static readonly MAX_VALUE = new BigNumber("9223372036854775807", 10);

  private readonly _fqcn = "java.lang.Long";

  public from(asString: string): BigNumber {
    // simulate Java's Long number range
    const BN = BigNumber.clone({ RANGE: 18, DECIMAL_PLACES: 0 });

    // forces integer value (the decimal places configuration are only applied when performing a division)
    // Also, truncates the decimal part the same way of Number type
    return new BN(asString).integerValue(BigNumber.ROUND_DOWN);
  }

  protected isInRange(n: BigNumber): boolean {
    return n.isGreaterThanOrEqualTo(JavaLong.MIN_VALUE) && n.isLessThanOrEqualTo(JavaLong.MAX_VALUE);
  }
}
