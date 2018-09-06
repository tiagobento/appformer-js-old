import FloatBasedJavaNumber from "appformer/java-wrappers/FloatBasedJavaNumber";

export default class JavaFloat extends FloatBasedJavaNumber {
  public static readonly MIN_VALUE = -3.40282347e38;
  public static readonly MAX_VALUE = 3.40282347e38;

  private readonly _fqcn = "java.lang.Float";

  protected isInRange(n: number): boolean {
    return n >= JavaFloat.MIN_VALUE && n <= JavaFloat.MAX_VALUE;
  }
}
