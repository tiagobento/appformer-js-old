import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective, ComponentContainer } from "appformer-js";

export class ShowcasePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "showcase-perspective";
    this.af_perspectiveScreens = [
      "console-header",
      "A-react-screen",
      "dom-elements-screen",
      "string-template-screen",
      "silly-react-screen"
    ];
    this.af_isDefaultPerspective = true;
  }

  private spaced(component: any) {
    return <div style={{ minWidth: "300px", margin: "5px", minHeight: "100%" }}>{component}</div>;
  }

  public af_perspectiveRoot(): Element {
    return (
      <div className={"wrapper"}>
        <header>
          <ComponentContainer af_componentId={"console-header"} />
        </header>

        {this.spaced(<ComponentContainer af_componentId={"A-react-screen"} />)}
        {this.spaced(<ComponentContainer af_componentId={"dom-elements-screen"} />)}
        {this.spaced(<ComponentContainer af_componentId={"string-template-screen"} />)}
        {this.spaced(<ComponentContainer af_componentId={"silly-react-screen"} />)}
      </div>
    );
  }
}

export class ConsolePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "console-perspective";
    this.af_perspectiveScreens = ["console-header", "dom-elements-screen"];
    this.af_isDefaultPerspective = false;
  }

  public af_perspectiveRoot(): Element {
    return <Console />;
  }
}

export class NonReactShowcasePerspective extends Perspective {
    constructor() {
        super();
        this.isReact = false;
        this.af_componentId = "non-react-showcase-perspective";
        this.af_perspectiveScreens = [
            "console-header",
            "string-template-screen",
            "silly-react-screen"
        ];
        this.af_isDefaultPerspective = true;
    }

    public af_perspectiveRoot(): string {
        return (
            `\<div class="wrapper">
                \<header>
                    <div id="af-js-component--console-header" />
                \</header>

                \<div id="af-js-component--string-template-screen" />
                \<div id="af-js-component--silly-react-screen" />
            \</div>`
        );
    }
}
