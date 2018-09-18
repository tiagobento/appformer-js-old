import { FloatBasedJavaNumber } from "./FloatBasedJavaNumber";
import { JavaByte } from "./JavaByte";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "./JavaNumber";
import { JavaDouble } from "./JavaDouble";
import { JavaInteger } from "./JavaInteger";
import { JavaShort } from "./JavaShort";
import { JavaLong } from "./JavaLong";

export class JavaFloat extends FloatBasedJavaNumber implements JavaNumber {
  public static readonly MIN_VALUE = -3.40282347e38;
  public static readonly MAX_VALUE = 3.40282347e38;

  private readonly _fqcn = "java.lang.Float";

  protected isInRange(n: number): boolean {
    return n >= JavaFloat.MIN_VALUE && n <= JavaFloat.MAX_VALUE;
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
