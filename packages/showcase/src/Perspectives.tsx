import * as React from "react";
import { Perspective, Element } from "appformer-js";

export class ShowcasePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "showcase-perspective";
    this.af_isDefaultPerspective = true;
  }

  private NiceBox(props: { children: any }) {
    return (
      <>
        <div style={{ minWidth: "300px", margin: "5px", minHeight: "100%" }}>{props.children}</div>
      </>
    );
  }

  public af_componentRoot(): Element {
    return (
      <div className={"wrapper"}>
        <header>
          <div af-js-component={"console-header"} />
        </header>

        <this.NiceBox>
          <div af-js-component={"A-react-screen"} />
        </this.NiceBox>
        <this.NiceBox>
          <div af-js-component={"dom-elements-screen"} />
        </this.NiceBox>
        <this.NiceBox>
          <div af-js-component={"string-template-screen"} />
        </this.NiceBox>
        <this.NiceBox>
          <div af-js-component={"silly-react-screen"} />
        </this.NiceBox>
      </div>
    );
  }
}


export class NonReactShowcasePerspective extends Perspective {
    constructor() {
        super();
        this.isReact = false;
        this.af_componentId = "non-react-showcase-perspective";
        this.af_isDefaultPerspective = true;
    }

    public af_componentRoot(): string {
        return `\<div>
                \<header>
                    <div af-js-component="console-header"></div>
                \</header>

                \<div af-js-component="string-template-screen"></div>
                \<div af-js-component="silly-react-screen"></div>
            \</div>`;
    }
}
