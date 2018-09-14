import NumberWrapper from "appformer/java-wrappers/NumberWrapper";

export default abstract class IntegerBasedJavaNumber extends NumberWrapper {
  protected from(asString: string): number {
    return Number.parseInt(asString, 10);
  }
}
