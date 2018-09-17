import {BigNumber} from "bignumber.js";
import {BigNumberWrapper} from "./BigNumberWrapper";
import {JavaByte} from "./JavaByte";
import {asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber} from "./JavaNumber";
import {JavaDouble} from "./JavaDouble";
import {JavaFloat} from "./JavaFloat";
import {JavaInteger} from "./JavaInteger";
import {JavaShort} from "./JavaShort";
import {JavaLong} from "./JavaLong";

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
