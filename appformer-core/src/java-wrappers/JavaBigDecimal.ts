import { BigNumber } from "bignumber.js";
import { BigNumberWrapper } from "java-wrappers/BigNumberWrapper";
import { JavaByte } from "java-wrappers/JavaByte";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "java-wrappers/JavaNumber";
import { JavaDouble } from "java-wrappers/JavaDouble";
import { JavaFloat } from "java-wrappers/JavaFloat";
import { JavaInteger } from "java-wrappers/JavaInteger";
import { JavaShort } from "java-wrappers/JavaShort";
import { JavaLong } from "java-wrappers/JavaLong";

export class JavaBigDecimal extends BigNumberWrapper implements JavaNumber {
  private readonly _fqcn = "java.math.BigDecimal";

  public from(asString: string): BigNumber {
    return new BigNumber(asString, 10);
  }

  public isInRange(n: BigNumber): boolean {
    return true; // arbitrary precision
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
