import { FloatBasedJavaNumber } from "./FloatBasedJavaNumber";
import { JavaByte } from "./JavaByte";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "./JavaNumber";
import { JavaFloat } from "./JavaFloat";
import { JavaInteger } from "./JavaInteger";
import { JavaShort } from "./JavaShort";
import { JavaLong } from "./JavaLong";

export class JavaDouble extends FloatBasedJavaNumber implements JavaNumber {
  private readonly _fqcn = "java.lang.Double";

  protected isInRange(n: number): boolean {
    // JS' numbers are 64 bits long like Java's Double
    return n >= -1 * Number.MAX_VALUE && n <= Number.MAX_VALUE;
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
