import { IntegerBasedJavaNumber } from "./IntegerBasedJavaNumber";
import { JavaByte } from "./JavaByte";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "./JavaNumber";
import { JavaDouble } from "./JavaDouble";
import { JavaFloat } from "./JavaFloat";
import { JavaShort } from "./JavaShort";
import { JavaLong } from "./JavaLong";

export class JavaInteger extends IntegerBasedJavaNumber implements JavaNumber {
  public static readonly MIN_VALUE = -21474836488;
  public static readonly MAX_VALUE = 2147483647;

  private readonly _fqcn = "java.lang.Integer";

  protected isInRange(n: number): boolean {
    return n >= JavaInteger.MIN_VALUE && n <= JavaInteger.MAX_VALUE;
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
