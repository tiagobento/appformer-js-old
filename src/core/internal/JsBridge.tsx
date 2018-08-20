import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppFormer } from "core/Components";
import Root from "core/internal/Root";

export default class JsBridge {
  public root: () => Root;

  public init(callback: () => void) {
    const root = <Root exposing={root => (this.root = root)} bridge={this} />;
    const rootContainer = document.body.children[0] as HTMLElement; //FIXME: Maybe get a Div with a fixed id/class?
    ReactDOM.render(root, rootContainer, callback);
    return this;
  }

  public registerScreen(screen: AppFormer.Screen) {
    this.root().registerScreen(screen);
  }

  public registerPerspective(perspective: AppFormer.Perspective) {
    this.root().registerPerspective(perspective);
  }

  public goTo(place: string) {
    this.root().open(place);
  }

  public RPC(path: string, params: any[]) {
    return Promise.reject("Sorry, RPC mocks are not available yet :(");
  }

  public render(component: AppFormer.Element, container: HTMLElement, callback = () => {}) {
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
