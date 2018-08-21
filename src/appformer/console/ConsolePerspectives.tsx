import { Screen, Perspective, Element } from "appformer/Components";
import Console from "appformer/console/Console";
import * as React from "react";

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
