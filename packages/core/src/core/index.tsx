import * as React from "react";
import { Component } from "./Component";
import { Core } from "./Core";

export * from "./Component";
export { RootContext, RootContextValue, CoreContext } from "./CoreRoot";
export { ComponentEnvelope } from "./ComponentEnvelope";
export { ComponentContainer } from "./ComponentContainer";

export function init(app: Component, container: HTMLElement): Core {
  return new Core().init(app, container, () => {
    console.info("Core instance initialized.");
  });
}
