import * as React from "react";
import {Console} from "./Console";
import {Element, Perspective, Screen} from "appformer-js";

export class ConsoleDefaultPerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "default-perspective";
    this.af_perspectiveScreens = ["console-dock", "console-header", "A-react-screen"];
    this.af_isDefaultPerspective = true;
  }

  public af_perspectiveRoot(root: { ss: Screen[]; ps: Perspective[] }): Element {
    return <Console screens={root.ss} />;
  }
}
