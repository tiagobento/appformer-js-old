import { PathImpl } from "@kiegroup-ts-generated/uberfire-api";
import PathDEC from "./PathDEC";

export default class PathImplDEC extends PathImpl implements PathDEC {
  public blergs(): string {
    return "path-impl";
  }
}
