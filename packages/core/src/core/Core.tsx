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

  public render(component: Element, container: HTMLElement, callback = (): void => undefined) {
    if (component instanceof HTMLElement) {
      container.innerHTML = ""; //FIXME: Doesn't work well on IE.
      container.appendChild(component);
      callback();
    } else if (typeof component === "string") {
      container.innerHTML = component; //FIXME: Maybe create a Text node and append it?
      callback();
    }
  }
}
