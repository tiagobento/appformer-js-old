import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective } from "appformer-js";

export class ConsolePerspective extends Perspective {
  constructor() {
    super("console-perspective");
    this.af_isReact = true;
    this.af_isDefault = false;
  }

  public af_componentRoot(): Element {
    return <Console />;
  }
}
