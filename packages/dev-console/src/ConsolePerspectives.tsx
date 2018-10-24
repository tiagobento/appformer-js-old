import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective, ComponentContainer } from "appformer-js";

export class ShowcasePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "showcase-perspective";
    this.af_isDefaultPerspective = true;
  }

  private wrapped(component: any) {
    return (
      <div style={{ minWidth: "300px", margin: "5px", minHeight: "100%" }}>
        <div className={"af-screen-container"}>
          <div className={"title"}>
            <this.TitleBar />
          </div>
          {component}
        </div>
      </div>
    );
  }

  private TitleBar() {
    return (
      <span>
        <span>Title goes here</span>
        &nbsp;&nbsp;
        <a href="#" style={{lineHeight: "1.6", float:"right"}}>Close</a>
      </span>
    );
  }

  public af_componentRoot(): Element {
    return (
      <div className={"wrapper"}>
        <header>
          <ComponentContainer af_componentId={"console-header"} />
        </header>

        {this.wrapped(<ComponentContainer af_componentId={"A-react-screen"} />)}
        {this.wrapped(<ComponentContainer af_componentId={"dom-elements-screen"} />)}
        {this.wrapped(<ComponentContainer af_componentId={"A-react-screen"} />)}
        {this.wrapped(<ComponentContainer af_componentId={"string-template-screen"} />)}
        {this.wrapped(<ComponentContainer af_componentId={"silly-react-screen"} />)}
      </div>
    );
  }
}

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
