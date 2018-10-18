import * as React from "react";
import * as ReactDOM from "react-dom";
import { Root } from "./Root";
import { Perspective } from "../api/Perspective";
import { Screen } from "../api/Screen";
import { RootElement } from "../api/Components";

export class JsBridge {
  private root: () => Root;

  public init(callback: () => void) {
    const root = <Root exposing={r => (this.root = r)} bridge={this} />;
    const rootContainer = document.body.children[0] as HTMLElement; // FIXME: Maybe get a Div with a fixed id/class?
    ReactDOM.render(root, rootContainer, callback);
    return this;
  }

  public registerScreen(screen: Screen) {
    this.root().registerScreen(screen);
  }

  public registerPerspective(perspective: Perspective) {
    this.root().registerPerspective(perspective);
  }

  public goTo(place: string) {
    this.root().open(place);
  }

  public translate(key: string, ...a: any[]) {
    return `Translated ${key}`;
  }

  public rpc(path: string, args: any[]) {
    return Promise.reject("Sorry, RPC mocks are not available yet :(");
  }

  public render(component: RootElement, container: HTMLElement, callback = (): void => undefined) {
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
