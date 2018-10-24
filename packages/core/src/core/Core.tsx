import * as React from "react";
import * as ReactDOM from "react-dom";
import { Element, Component } from "./Component";
import { CoreRoot } from "./CoreRoot";

export class Core {
  public root: CoreRoot;

  public init(app: Component, container: HTMLElement, callback: () => void) {
    ReactDOM.render(<CoreRoot exposing={ref => (this.root = ref())} core={this} app={app} />, container, callback);
    return this;
  }

  public register(component: Component, type: string) {
    console.info(`Registering ${component.af_componentId}...`);
    this.root.register(component, type);
  }
  public goTo() {

  }

  public translate() {

  }

  public render(component: Element, container: HTMLElement, callback = (): void => undefined) {
    if (component instanceof HTMLElement) {
      container.innerHTML = "";
      container.appendChild(component);
      callback();
    } else if (typeof component === "string") {
      container.innerHTML = component;
      callback();
    }
  }
}
