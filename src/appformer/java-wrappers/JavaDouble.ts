import FloatBasedJavaNumber from "appformer/java-wrappers/FloatBasedJavaNumber";

export default class JavaDouble extends FloatBasedJavaNumber {
  private readonly _fqcn = "java.lang.Double";

  protected isInRange(n: number): boolean {
    return true; // JS' numbers are 64 bits long like Java's Double
  }
}
