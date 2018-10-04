import { IntegerBasedJavaNumber } from "./IntegerBasedJavaNumber";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "./JavaNumber";
import { JavaByte } from "./JavaByte";
import { JavaDouble } from "./JavaDouble";
import { JavaFloat } from "./JavaFloat";
import { JavaInteger } from "./JavaInteger";
import { JavaLong } from "./JavaLong";
import { JavaType } from "./JavaType";

export class JavaShort extends IntegerBasedJavaNumber implements JavaNumber {
  public static readonly MIN_VALUE = -32768;
  public static readonly MAX_VALUE = 32767;

  private readonly _fqcn = JavaType.SHORT;

  protected isInRange(n: number): boolean {
    return n >= JavaShort.MIN_VALUE && n <= JavaShort.MAX_VALUE;
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
