import IntegerBasedJavaNumber from "appformer/java-wrappers/IntegerBasedJavaNumber";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaByte extends IntegerBasedJavaNumber implements JavaNumber {
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
