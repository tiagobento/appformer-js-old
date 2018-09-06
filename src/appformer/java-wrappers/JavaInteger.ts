import IntegerBasedJavaNumber from "appformer/java-wrappers/IntegerBasedJavaNumber";

export default class JavaInteger extends IntegerBasedJavaNumber {
  public static readonly MIN_VALUE = -21474836488;
  public static readonly MAX_VALUE = 2147483647;

  private readonly _fqcn = "java.lang.Integer";

  protected isInRange(n: number): boolean {
    return n >= JavaInteger.MIN_VALUE && n <= JavaInteger.MAX_VALUE;
  }
}
