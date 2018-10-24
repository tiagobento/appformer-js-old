import * as ReactDOM from "react-dom";
import { JsBridge } from "../internal/JsBridge";
import { Perspective } from "./Perspective";
import { Screen } from "./Screen";
import { RootElement } from "./Components";
import { marshall } from "../marshalling";

export * from "./Components";
export * from "./DisplayInfo";
export * from "./Panel";
export * from "./Part";
export * from "./Perspective";
export * from "./Screen";

export const bridge =
  ((window as any).appformerGwtBridge as JsBridge) ||
  new JsBridge().init(document.body.children[0] as HTMLElement, () => {
    console.info("Finished mounting AppFormer JS");
  });

export const render = bridge.render;

export const translate = bridge.translate;

export function goTo(af_componentId: string) {
  return bridge.goTo(af_componentId);
}

export function rpc(path: string, ...args: any[]): Promise<string> {
  return bridge.rpc(path, args);
}

export function fireEvent(obj: any) {
  bridge.sendEvent(marshall(obj));
}

export function register(potentialComponents: any) {
  for (const potentialComponent in potentialComponents) {
    if (potentialComponents.hasOwnProperty(potentialComponent)) {
      const Component = potentialComponents[potentialComponent];

      if (Component.prototype instanceof Screen) {
        const component = new Component();
        console.info(`Registering screen [${component.af_componentId}]`);
        bridge.registerScreen(component);
      } else if (Component.prototype instanceof Perspective) {
        const component = new Component();
        console.info(`Registering perspective [${component.af_componentId}]`);
        bridge.registerPerspective(component);
      } else {
        console.info(`Registering other kind of component [${Component.prototype.constructor.name}]`);
        // TODO: Register other kinds of components
      }
    }
  }
}
