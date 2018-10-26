import * as React from "react";
import { Perspective, Element } from "appformer-js";

export class ShowcasePerspective extends Perspective {
  constructor() {
    super("showcase-perspective");
    this.af_isReact = true;
    this.af_isDefault = true;
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
    super("non-react-showcase-perspective");
    this.af_isReact = false;
    this.af_isDefault = true;
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
