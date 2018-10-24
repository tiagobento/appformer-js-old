import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective, ComponentContainer, AppFormerContext, CoreRootContext } from "appformer-js";

export class ShowcasePerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "showcase-perspective";
    this.af_isDefaultPerspective = true;
  }

  private NiceBox(props: { af_componentId: string }) {
    return (
      <div style={{ minWidth: "300px", margin: "5px", minHeight: "100%" }}>
        <CoreRootContext.Consumer>
          {core =>
            Object.keys(core.components).indexOf(props.af_componentId) !== -1 && (
              <div key={props.af_componentId} className={"af-screen-container"}>
                <div className={"title"}>
                  <>{this.TitleBar({ af_componentId: props.af_componentId })}</>
                </div>
                <ComponentContainer af_componentId={props.af_componentId} />
              </div>
            )
          }
        </CoreRootContext.Consumer>
      </div>
    );
  }

  private TitleBar(props: { af_componentId: string }) {
    return (
      <AppFormerContext.Consumer>
        {appformer => (
          <span>
            <span> Title goes here</span>
            &nbsp;&nbsp;
            <a
              href="#"
              style={{ lineHeight: "1.6", float: "right" }}
              onClick={() => appformer.api!.close(props.af_componentId)}
            >
              Close
            </a>
          </span>
        )}
      </AppFormerContext.Consumer>
    );
  }

  public af_componentRoot(): Element {
    return (
      <div className={"wrapper"}>
        <header>
          <ComponentContainer af_componentId={"console-header"} />
        </header>

        {this.NiceBox({ af_componentId: "A-react-screen" })}
        {this.NiceBox({ af_componentId: "dom-elements-screen" })}
        {this.NiceBox({ af_componentId: "string-template-screen" })}
        {this.NiceBox({ af_componentId: "silly-react-screen" })}
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
