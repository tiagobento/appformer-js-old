import * as ReactDOM from "react-dom";
import { Screen, Perspective } from "appformer/Components";
import JsBridge from "appformer/internal/JsBridge";
import { Portable, ErraiBusObject } from "generated/Model";

const jsBridge = new JsBridge();

const bridge =
  (window as any).appformerGwtBridge ||
  jsBridge.init(() => {
    console.info("Finished mounting AppFormer JS");
  });

export const render =
  bridge.render ||
  ((component: Element, container: HTMLElement, callback = (): void => undefined) => {
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

export function unmarshall(a: any) {
  return JSON.parse(a); //TODO: Implement
}

export function marshall(obj: Portable<any> & ErraiBusObject | string) {
  return typeof obj !== "string" ? obj.__toErraiBusObject().__toJson() : obj;
}

export function rpc(path: string, ...args: any[]) {
  return bridge.rpc(path, args).then((erraiJson: string) => unmarshall(erraiJson));
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
        // TODO: Register other kinds of components
      }
    }
  }
}
