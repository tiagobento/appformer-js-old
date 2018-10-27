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

  public register(...components: Component[]) {
    console.info(`Registering ${components.map(c => c.core_componentId).join(", ")}...`);
    this.coreRoot.register(...components);
  }

  public deregister(...ids: string[]) {
    console.info(`Registering ${ids.join(", ")}...`);
    this.coreRoot.deregister(...ids);
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
