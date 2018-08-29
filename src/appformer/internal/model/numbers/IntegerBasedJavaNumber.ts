import { JavaNumber } from "./JavaNumber";

export class IntegerBasedJavaNumber extends JavaNumber {
  public from(asString: string): number {
    return Number.parseInt(asString, 10);
  }
}
