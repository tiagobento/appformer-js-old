import { IntegerBasedJavaNumber } from "./IntegerBasedJavaNumber";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "./JavaNumber";
import { JavaDouble } from "./JavaDouble";
import { JavaFloat } from "./JavaFloat";
import { JavaInteger } from "./JavaInteger";
import { JavaShort } from "./JavaShort";
import { JavaLong } from "./JavaLong";

export class JavaByte extends IntegerBasedJavaNumber implements JavaNumber {
  public static readonly MIN_VALUE = -128;
  public static readonly MAX_VALUE = 127;

  private readonly _fqcn = "java.lang.Byte";

  protected isInRange(n: number): boolean {
    return n >= JavaByte.MIN_VALUE && n <= JavaByte.MAX_VALUE;
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
