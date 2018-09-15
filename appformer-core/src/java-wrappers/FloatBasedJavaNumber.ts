import { NumberWrapper } from "./NumberWrapper";

export abstract class FloatBasedJavaNumber extends NumberWrapper {
  protected from(asString: string): number {
    return Number.parseFloat(asString);
  }
}
