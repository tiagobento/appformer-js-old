import JavaNumber from "appformer/java-wrappers/JavaNumber";

export default abstract class IntegerBasedJavaNumber extends JavaNumber {
  protected from(asString: string): number {
    return Number.parseInt(asString, 10);
  }
}
