import * as React from "react";
import * as ReactDOM from "react-dom";
import { Element, Component } from "./Component";
import { CoreRoot } from "./CoreRoot";

export class Core {
  public coreRoot: CoreRoot;

  public init(app: Component, container: HTMLElement, callback: () => void) {
    ReactDOM.render(<CoreRoot exposing={ref => (this.coreRoot = ref())} core={this} app={app} />, container, callback);
    return this;
  }

  public register(component: Component) {
    console.info(`Registering ${component.af_componentId}...`);
    this.coreRoot.register(component);
  }

  public deregister(af_componentId: string) {
    console.info(`Deregistering ${af_componentId}...`);
    this.coreRoot.deregister(af_componentId);
  }

  public render(element: Element, container: HTMLElement, callback = (): void => undefined) {
    if (element instanceof HTMLElement) {
      container.innerHTML = ""; //FIXME: Doesn't work well on IE.
      container.appendChild(element);
      callback();
    } else if (typeof element === "string") {
      container.innerHTML = element; //FIXME: Maybe create a Text node and append it?
      callback();
    }
  }
}
