import IntegerBasedJavaNumber from "./IntegerBasedJavaNumber";

export default class JavaByte extends IntegerBasedJavaNumber {
  public static readonly MIN_VALUE = -128;
  public static readonly MAX_VALUE = 127;

  private readonly _fqcn = "java.lang.Byte";

  protected isInRange(n: number): boolean {
    return n >= JavaByte.MIN_VALUE && n <= JavaByte.MAX_VALUE;
  }
}
