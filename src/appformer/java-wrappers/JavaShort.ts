import IntegerBasedJavaNumber from "appformer/java-wrappers/IntegerBasedJavaNumber";

export default class JavaShort extends IntegerBasedJavaNumber {

  public static readonly MIN_VALUE = -32768;
  public static readonly MAX_VALUE = 32767;

  private readonly _fqcn = "java.lang.Short";

  protected isInRange(n: number): boolean {
    return n >= JavaShort.MIN_VALUE && n <= JavaShort.MAX_VALUE;
  }
}
