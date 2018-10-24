import { AppFormer } from "./AppFormer";
import { Screen, Perspective } from "./Components";
import { Element } from "../core";

export {AppFormer} from "./AppFormer";
export * from "./Components";
export * from "./Shorthands";
export { AppFormerContext, AppFormerContextValue} from "./AppFormerRoot";

export function init(container: HTMLElement): AppFormer {
  return new AppFormer().init(container, () => {
    console.info("AppFormer instance initialized.");
  });
}

const $wnd = window as any;
let singleton: AppFormer | undefined;

if ($wnd.AppFormerMode !== "instance") {
  singleton =
    $wnd.appformerGwtBridge ||
    new AppFormer().init(document.body.children[0] as HTMLElement, () => {
      console.info("AppFormer _standalone_ instance initialized.");
    });

  $wnd.AppFormerInstance = singleton;
}

export function registerScreen(screen: Screen) {
  singleton!.register(screen);
}

export function registerPerspective(perspective: Perspective) {
  singleton!.register(perspective);
}

export function goTo(af_componentId: string) {
  singleton!.goTo(af_componentId);
}

export function close(af_componentId: string) {
  singleton!.close(af_componentId);
}

export function translate(key: string, args: string[]) {
  singleton!.translate(key, args);
}

export function render(component: Element, container: HTMLElement, callback = (): void => undefined) {
  singleton!.core.render(component, container, callback);
}

export function fireEvent(obj: any) {
  console.info("Firing event: " + obj);
}

export function rpc(path: string, args: any[]) {
  return Promise.reject("Sorry, RPC mocks are not available yet :(");
}
