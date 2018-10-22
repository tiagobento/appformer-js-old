//
//
//
//
// FIXME: All public API methods need a revision. Their names are *temporary*.

import * as React from "react";
import { Screen } from "./Screen";
import { Perspective } from "./Perspective";

export const DefaultComponentContainerId = "af-js-default-screen-container";

export interface Subscriptions {
  [channel: string]: (event: any) => void;
}

export interface Service {
  [name: string]: any; //FIXME: 'any' is a baaad choice
}

export type GenericComponent = Screen | Perspective;

export type RootElement = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;

export class Menu {
  // TODO
}

export class Toolbar {
  // TODO
}
