import FloatBasedJavaNumber from "appformer/java-wrappers/FloatBasedJavaNumber";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaFloat extends FloatBasedJavaNumber implements JavaNumber {
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
