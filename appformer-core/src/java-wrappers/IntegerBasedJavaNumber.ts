import { NumberWrapper } from "./NumberWrapper";

export abstract class IntegerBasedJavaNumber extends NumberWrapper {
  protected from(asString: string): number {
    return Number.parseInt(asString, 10);
  }
}
