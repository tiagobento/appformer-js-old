import JavaNumber from "appformer/java-wrappers/JavaNumber";

export default abstract class FloatBasedJavaNumber extends JavaNumber {
  protected from(asString: string): number {
    return Number.parseFloat(asString);
  }
}
