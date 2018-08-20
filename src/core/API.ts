import * as ReactDOM from "react-dom";
import { AppFormer } from "core/Components";
import JsBridge from "core/internal/JsBridge";

const jsBridge = new JsBridge();

const bridge =
  (window as any).appformerGwtBridge ||
  jsBridge.init(() => {
    console.info("Finished mounting AppFormer JS");
  });

export const render =
  bridge.render ||
  ((component: AppFormer.Element, container: HTMLElement, callback = () => {}) => {
    //FIXME: Duplicated!!

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

export const rpc = bridge.rpc;

export function goTo(place: string) {
  return bridge.goTo(place);
}

export function register(potentialComponents: any) {
  for (let potentialComponent in potentialComponents) {
    if (potentialComponents.hasOwnProperty(potentialComponent)) {
      const Component = potentialComponents[potentialComponent];

      if (Component.prototype instanceof AppFormer.Screen) {
        const component = new Component();
        console.info(`Registering screen [${Component.prototype.constructor.name}]`);
        bridge.registerScreen(component);
      } else if (Component.prototype instanceof AppFormer.Perspective) {
        const component = new Component();
        console.info(`Registering perspective [${Component.prototype.constructor.name}]`);
        bridge.registerPerspective(component);
      } else {
        //TODO: Register other kinds of components
      }
    }
  }
}
