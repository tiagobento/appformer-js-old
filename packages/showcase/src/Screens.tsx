import * as React from "react";
import { DemoReactComponent } from "./DemoReactComponent";
import { Screen, AppFormerContext, Element } from "appformer-js";

export class ReactComponentScreen extends Screen {
  public onFoo: (e: any) => void;

  constructor() {
    super("A-react-screen");
    this.af_isReact = true;
    this.af_componentTitle = "React Component";
    this.af_subscriptions = new Map();
    this.af_componentService = {};
  }

  public af_onStartup() {
    console.info(`Startup ${this.af_componentId}`);
  }

  public af_onOpen() {
    console.info(`[${this.af_componentId}] is open! :: It's a pure React component`);
  }

  public af_onFocus() {
    console.info(`Focused on ${this.af_componentId}`);
  }

  public af_onLostFocus() {
    console.info(`Lost focus on ${this.af_componentId}`);
  }

  public af_onClose() {
    console.info(`Closed ${this.af_componentId}`);
  }

  public af_onShutdown() {
    console.info(`Shut down ${this.af_componentId}`);
  }

  public af_componentRoot(): Element {
    return (
      <NiceScreenWrapper screen={this}>
        <div>
          <br />
          <button className={"btn btn-primary btn-sm"} onClick={() => console.info("Button was clicked.")}>
            Click me to make server send an event...
          </button>
          <br />

          <DemoReactComponent number={this.af_componentId} onFoo={(x: any) => (this.onFoo = x)} />
        </div>
      </NiceScreenWrapper>
    );
  }
}

export class PureDomElementScreen extends Screen {
  public span: HTMLElement;

  constructor() {
    super("dom-elements-screen");
    this.af_componentTitle = "DOM Elements Component";
    this.span = document.createElement("span");
    this.af_componentService = {};
  }

  public af_onMayClose() {
    return true; // this.span.textContent === "close me!";
  }

  public af_componentRoot() {
    const button = document.createElement("button");
    button.textContent = "This is a HTMLButtonElement";

    const label = document.createElement("label");
    label.textContent = "This is also a Foo Message: ";

    const div = document.createElement("div");
    div.appendChild(button);
    div.appendChild(document.createElement("br"));
    div.appendChild(label);
    div.appendChild(this.span);

    button.onclick = e => {
      const container = document.createElement("div");
      container.setAttribute("af-js-component", "A-react-screen");
      div.appendChild(container);
    };

    return div;
  }
}

export class StringElementScreen extends Screen {
  constructor() {
    super("string-template-screen");
    this.af_componentTitle = "Pure HTML String Component";
  }

  public af_onMayClose() {
    return true;
  }

  public af_componentRoot() {
    return "<p style=\"color: red\"> Hi, I'm a simple pure HTML String Template</p>";
  }
}

export class SillyReactScreen extends Screen {
  constructor() {
    super("silly-react-screen");
    this.af_isReact = true;
    this.af_componentTitle = "Silly React Component";
  }

  public af_componentRoot(): Element {
    return (
      <NiceScreenWrapper screen={this}>
        <h1>{`This is just an <h1>`}</h1>
      </NiceScreenWrapper>
    );
  }
}

class NiceScreenWrapper extends React.Component<{ screen: Screen }, {}> {
  public render() {
    return (
      <div className={"af-screen-container"}>
        {this.props.screen.af_componentTitle && (
          <>
            <div className={"title"}>{this.closeButton()}</div>
          </>
        )}
        {this.props.children}
      </div>
    );
  }

  private closeButton() {
    return (
      <AppFormerContext.Consumer>
        {appformer => (
          <span>
            <span>{this.props.screen.af_componentTitle}</span>
            <a
              href="#"
              style={{ lineHeight: "1.6", float: "right" }}
              onClick={() => appformer.api!.close(this.props.screen.af_componentId)}
            >
              Close
            </a>
          </span>
        )}
      </AppFormerContext.Consumer>
    );
  }
}
