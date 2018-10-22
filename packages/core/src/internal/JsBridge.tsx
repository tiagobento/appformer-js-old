import * as React from "react";
import * as ReactDOM from "react-dom";
import { Element, Perspective, Screen } from "../api/Components";
import { Root } from "./Root";

export class JsBridge {
  private root: Root;

  public init(container: HTMLElement, callback: () => void) {
    const root = <Root exposing={ref => (this.root = ref())} bridge={this} />;
    ReactDOM.render(root, container, callback);
    return this;
  }

  public registerScreen(screen: Screen) {
    this.root.registerScreen(screen);
  }

  public registerPerspective(perspective: Perspective) {
    this.root.registerPerspective(perspective);
  }

  public goTo(place: string) {
    this.root.open(place);
  }

  public close(place: Screen) {
    this.root.close(place);
  }

  public translate(key: string, args: string[]) {
    return `Translated ${key}`;
  }

  public sendEvent(obj: any) {
      console.info("Firing event: " + obj);
  }

  public rpc(path: string, args: any[]) {
    return Promise.reject("Sorry, RPC mocks are not available yet :(");
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
