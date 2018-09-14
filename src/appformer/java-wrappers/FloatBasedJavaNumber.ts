import NumberWrapper from "appformer/java-wrappers/NumberWrapper";

export default abstract class FloatBasedJavaNumber extends NumberWrapper {
  protected from(asString: string): number {
    return Number.parseFloat(asString);
  }
}
