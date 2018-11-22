import { AppFormer } from "./AppFormer";
import { Element } from "../core";
import { Component } from "./Component";
import { Perspective } from "./Perspective";
import { Screen } from "./Screen";

export * from "./AppFormer";
export * from "./Components";
export * from "./Shorthands";
export * from "./Screen";
export * from "./ComponentTypes";
export * from "./Perspective";
export * from "./DisplayInfo";
export * from "./Panel";
export * from "./Part";
export { AppFormerContext, AppFormerContextValue } from "./AppFormerRoot";

let singleton: AppFormer | undefined;

export function initSingleton() {
  const $wnd = window as any;

  if ($wnd.AppFormerMode !== "instance") {
    singleton =
      $wnd.appformerGwtBridge ||
      new AppFormer().init(document.body.children[0] as HTMLElement, () => {
        console.info("AppFormer _standalone_ instance initialized.");
      });

    $wnd.AppFormerInstance = singleton;
  }
}

export function init(container: HTMLElement): AppFormer {
  return new AppFormer().init(container, () => {
    console.info("AppFormer instance initialized.");
  });
}

//
//Singleton API

export function register(component: Component) {
  if (component.type === "screen") {
    singleton!.registerScreen(component as Screen);
  } else if (component.type === "perspective") {
    singleton!.registerPerspective(component as Perspective);
  }
}

export function goTo(af_componentId: string) {
  singleton!.goTo(af_componentId);
}

export function close(af_componentId: string) {
  singleton!.close(af_componentId);
}

export function translate(key: string, args: string[]) {
  return singleton!.translate(key, args);
}

export function render(element: Element, container: HTMLElement, callback = (): void => undefined) {
  singleton!.render(element, container, callback);
}

export function fireEvent(obj: any) {
  singleton!.fireEvent(obj);
}

export function rpc(path: string, args: any[]) {
  return singleton!.rpc(path, args);
}
