import { BigNumber } from "bignumber.js";
import BigNumberWrapper from "appformer/java-wrappers/BigNumberWrapper";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaBigInteger extends BigNumberWrapper implements JavaNumber {
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
