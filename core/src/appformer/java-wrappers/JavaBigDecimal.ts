import BigNumber from "bignumber.js";
import BigNumberWrapper from "appformer/java-wrappers/BigNumberWrapper";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaBigDecimal extends BigNumberWrapper implements JavaNumber {
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
