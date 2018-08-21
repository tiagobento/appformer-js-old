import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Components from "app-former/Components";
import Root from "app-former/internal/Root";

export default class JsBridge {
  public root: () => Root;

  public init(callback: () => void) {
    const root = <Root exposing={rootParam => (this.root = rootParam)} bridge={this} />;
    const rootContainer = document.body.children[0] as HTMLElement; // FIXME: Maybe get a Div with a fixed id/class?
    ReactDOM.render(root, rootContainer, callback);
    return this;
  }

  public registerScreen(screen: Components.Screen) {
    this.root().registerScreen(screen);
  }

  public registerPerspective(perspective: Components.Perspective) {
    this.root().registerPerspective(perspective);
  }

  public goTo(place: string) {
    this.root().open(place);
  }

  public translate(key: string, ...a: any[]) {
    return `Translated ${key}`;
  }

  public rpc(path: string, params: any[]) {
    return Promise.reject("Sorry, RPC mocks are not available yet :(");
  }

  public render(component: Components.Element, container: HTMLElement, callback = (): void => undefined) {
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
