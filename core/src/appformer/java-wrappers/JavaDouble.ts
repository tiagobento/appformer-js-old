import FloatBasedJavaNumber from "appformer/java-wrappers/FloatBasedJavaNumber";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaDouble extends FloatBasedJavaNumber implements JavaNumber {
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
