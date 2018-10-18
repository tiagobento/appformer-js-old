import * as ReactDOM from "react-dom";
import { JsBridge } from "../internal/JsBridge";
import { Perspective } from "./Perspective";
import { Screen } from "./Screen";
import { RootElement } from "./Components";

export * from "./Components";
export * from "./DisplayInfo";
export * from "./Panel";
export * from "./Part";
export * from "./Perspective";
export * from "./Screen";

const jsBridge = new JsBridge();

const bridge =
  (window as any).appformerGwtBridge ||
  jsBridge.init(() => {
    console.info("Finished mounting AppFormer JS");
  });

export const render =
  bridge.render ||
  ((component: RootElement, container: HTMLElement, callback = (): void => undefined) => {
    // FIXME: Duplicated!!

    if (component instanceof HTMLElement) {
      container.innerHTML = "";
      container.appendChild(component);
      callback();
    } else if (typeof component === "string") {
      container.innerHTML = component;
      callback();
    } else {
      ReactDOM.render(component as any, container, callback);
    }
  });

export const translate = bridge.translate;

export function goTo(place: string) {
  return bridge.goTo(place);
}

export function rpc(path: string, ...args: any[]): Promise<string> {
  return bridge.rpc(path, args);
}

export function register(potentialComponents: any) {
  for (const potentialComponent in potentialComponents) {
    if (potentialComponents.hasOwnProperty(potentialComponent)) {
      const Component = potentialComponents[potentialComponent];

      if (Component.prototype instanceof Screen) {
        const component = new Component();
        console.info(`Registering screen [${Component.prototype.constructor.name}]`);
        bridge.registerScreen(component);
      } else if (Component.prototype instanceof Perspective) {
        const component = new Component();
        console.info(`Registering perspective [${Component.prototype.constructor.name}]`);
        bridge.registerPerspective(component);
      } else {
        console.info(`Registering other kind of component [${Component.prototype.constructor.name}]`);
        // TODO: Register other kinds of components
      }
    }
  }
}
