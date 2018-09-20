import { ObservablePathImpl } from "@kiegroup-ts-generated/uberfire-api";
import ObservablePathDEC from "./ObservablePathDEC";

export default class ObservablePathImplDEC extends ObservablePathImpl implements ObservablePathDEC {
  public blergs(): string {
    return "observable-path-impl";
  }
}
