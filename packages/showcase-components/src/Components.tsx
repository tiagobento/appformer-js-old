import * as React from "react";
import { DemoReactComponent } from "./DemoReactComponent";
import { JavaInteger, Screen } from "appformer-js";

export class InoffensiveNonScreenClass {}

export class ReactComponentScreen extends Screen {
  public onFoo: (e: any) => void;

  constructor() {
    super("A-react-screen");
    this.isReact = true;
    this.componentTitle = "React Component";
    this.subscriptions = {};
    this.componentService = {};

    console.info("Testing builtin type: " + new JavaInteger("42").get());
  }

  public af_onStartup() {
    console.info(`Startup ${this.componentId}`);
  }

  public af_onOpen() {
    console.info(`[${this.componentId}] is open! :: It's a pure React component`);
  }

  public af_onFocus() {
    console.info(`Focused on ${this.componentId}`);
  }

  public af_onLostFocus() {
    console.info(`Lost focus on ${this.componentId}`);
  }

  public af_onClose() {
    console.info(`Closed ${this.componentId}`);
  }

  public af_onShutdown() {
    console.info(`Shut down ${this.componentId}`);
  }

  public af_componentRoot() {
    return (
      <div>
        <br />
        <button className={"btn btn-primary btn-sm"} onClick={() => console.info("Button was clicked.")}>
          Click me to make server send an event...
        </button>
        <br />

        <DemoReactComponent number={this.componentId} onFoo={(x: any) => (this.onFoo = x)} />
      </div>
    );
  }
}

export class PureDomElementScreen extends Screen {
  public span: HTMLElement;

  constructor() {
    super("dom-elements-screen");
    this.componentTitle = "DOM Elements Component";
    this.span = document.createElement("span");
    this.componentService = {};
  }

  public af_onMayClose() {
    return true; // this.span.textContent === "close me!";
  }

  public af_componentRoot() {
    const button = document.createElement("button");
    button.textContent = "This is a HTMLButtonElement";
    button.onclick = e => console.info("HTMLButtonElement was clicked");

    const label = document.createElement("label");
    label.textContent = "This is also a Foo Message: ";

    const div = document.createElement("div");
    div.appendChild(button);
    div.appendChild(document.createElement("br"));
    div.appendChild(label);
    div.appendChild(this.span);
    return div;
  }
}

export class StringElementScreen extends Screen {
  constructor() {
    super("string-template-screen");
    this.componentTitle = "Pure HTML String Component";
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
    this.isReact = true;
    this.componentTitle = "Silly React Component";
  }

  public af_componentRoot() {
    return <h1>{`This is just an <h1>`}</h1>;
  }
}
