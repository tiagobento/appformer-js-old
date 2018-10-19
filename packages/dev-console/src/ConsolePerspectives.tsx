import * as React from "react";
import { Console } from "./Console";
import { Perspective, RootElement, Screen } from "appformer-js";

export class ConsoleDefaultPerspective extends Perspective {
  constructor() {
    super("default-perspective");
    this.isReact = true;
    this.perspectiveScreens = ["console-dock", "console-header", "A-react-screen"];
    this.isDefault = true;
  }

  public af_perspectiveRoot(root: { ss: Screen[]; ps: Perspective[] }): RootElement {
    return <Console screens={root.ss} />;
  }
}
