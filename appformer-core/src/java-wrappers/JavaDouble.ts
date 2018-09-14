import { FloatBasedJavaNumber } from "java-wrappers/FloatBasedJavaNumber";
import { JavaByte } from "java-wrappers/JavaByte";
import { asByte, asDouble, asFloat, asInteger, asLong, asShort, JavaNumber } from "java-wrappers/JavaNumber";
import { JavaFloat } from "java-wrappers/JavaFloat";
import { JavaInteger } from "java-wrappers/JavaInteger";
import { JavaShort } from "java-wrappers/JavaShort";
import { JavaLong } from "java-wrappers/JavaLong";

export class JavaDouble extends FloatBasedJavaNumber implements JavaNumber {
  private readonly _fqcn = "java.lang.Double";

  protected isInRange(n: number): boolean {
    return true; // JS' numbers are 64 bits long like Java's Double
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
