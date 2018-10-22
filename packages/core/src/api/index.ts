import { Perspective, Screen } from "./Components";
import { JsBridge } from "../internal/JsBridge";
import { marshall } from "../marshalling";

export * from "./Components";

export const bridge =
  ((window as any).appformerGwtBridge as JsBridge) ||
  new JsBridge().init(document.body.children[0] as HTMLElement, () => {
    console.info("Finished mounting AppFormer JS");
  });

export const render = bridge.render;

export const translate = bridge.translate;

export const goTo = bridge.goTo;

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
        // TODO: Register other kinds of components
      }
    }
  }
}
