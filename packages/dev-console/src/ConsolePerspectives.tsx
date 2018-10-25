import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective, AppFormerContext, CoreRootContext } from "appformer-js";

export class ConsolePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "console-perspective";
    this.af_isDefaultPerspective = false;
  }

  public af_componentRoot(): Element {
    return <Console />;
  }
}
