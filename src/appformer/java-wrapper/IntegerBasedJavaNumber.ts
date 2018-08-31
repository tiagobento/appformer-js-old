import JavaNumber from "appformer/java-wrapper/JavaNumber";

export default class IntegerBasedJavaNumber extends JavaNumber {
  public from(asString: string): number {
    return Number.parseInt(asString, 10);
  }
}
