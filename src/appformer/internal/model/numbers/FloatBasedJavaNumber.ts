import { JavaNumber } from "./JavaNumber";

export class FloatBasedJavaNumber extends JavaNumber {
  public from(asString: string): number {
    return Number.parseFloat(asString);
  }
}
