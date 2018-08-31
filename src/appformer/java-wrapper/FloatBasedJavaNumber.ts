import JavaNumber from "appformer/java-wrapper/JavaNumber";

export default class FloatBasedJavaNumber extends JavaNumber {
  public from(asString: string): number {
    return Number.parseFloat(asString);
  }
}
