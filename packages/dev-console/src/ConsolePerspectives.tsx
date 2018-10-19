import * as React from "react";
import { Console } from "./Console";
import { Perspective, RootElement, Screen } from "appformer-js";

export class ConsoleDefaultPerspective extends Perspective {
  constructor() {
    super("default-perspective");
    this.af_isReact = true;
    this.af_perspectiveScreens = ["console-dock", "console-header", "A-react-screen"];
    this.af_isDefault = true;
  }

  public af_perspectiveRoot(root: { ss: Screen[]; ps: Perspective[] }): RootElement {
    return <Console screens={root.ss} />;
  }
}
