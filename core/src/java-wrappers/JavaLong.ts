import {BigNumber} from "bignumber.js";
import {BigNumberWrapper} from "./BigNumberWrapper";
import {JavaByte} from "./JavaByte";
import {asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber} from "./JavaNumber";
import {JavaDouble} from "./JavaDouble";
import {JavaFloat} from "./JavaFloat";
import {JavaInteger} from "./JavaInteger";
import {JavaShort} from "./JavaShort";

export class JavaLong extends BigNumberWrapper implements JavaNumber {
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

  public byteValue(): JavaByte {
    return asByte(super.get());
  }

  public doubleValue(): JavaDouble {
    return asDouble(super.get());
  }

  public floatValue(): JavaFloat {
    return asFloat(super.get());
  }

  public intValue(): JavaInteger {
    return asInteger(super.get());
  }

  public shortValue(): JavaShort {
    return asShort(super.get());
  }

  public longValue(): JavaLong {
    return asLong(super.get());
  }
}
