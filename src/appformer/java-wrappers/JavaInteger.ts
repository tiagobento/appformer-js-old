import IntegerBasedJavaNumber from "appformer/java-wrappers/IntegerBasedJavaNumber";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaNumber, { asByte, asDouble, asFloat, asInteger, asLong, asShort } from "appformer/java-wrappers/JavaNumber";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaLong from "appformer/java-wrappers/JavaLong";

export default class JavaInteger extends IntegerBasedJavaNumber implements JavaNumber {
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
