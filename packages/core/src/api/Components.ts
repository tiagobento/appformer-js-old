//
//
//
//
// FIXME: All public API methods need a revision. Their names are *temporary*.

import * as React from "react";

export const DefaultScreenContainerId = "default-container-for-screens";

export interface Subscriptions {
  [channel: string]: (event: any) => void;
}

export interface Service {
  [name: string]: any; //FIXME: 'any' is a baaad choice
}

export type GenericComponent = Screen | Perspective;

export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;

export class Menu {
  // TODO
}

export class Toolbar {
  // TODO
}

export enum ContextDisplayMode {
  SHOW = "SHOW",
  HIDE = "HIDE"
}

export class DisplayInfo {
  public contextId?: string = undefined;
  public contextDisplayMode: ContextDisplayMode = ContextDisplayMode.SHOW;
}

export enum PanelType {
  MULTI_LIST = "org.uberfire.client.workbench.panels.impl.MultiListWorkbenchPanelPresenter",
  STATIC = "org.uberfire.client.workbench.panels.impl.StaticWorkbenchPanelPresenter"
}

export class Part {
  public placeName: string;
  public displayInfo: DisplayInfo = new DisplayInfo();
  public parameters?: {} = undefined;
}

export enum CompassPosition {
  NONE = "NONE",
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
  SELF = "SELF",
  ROOT = "ROOT",
  CENTER = "CENTER"
}

export class Panel {
  public position?: CompassPosition = undefined;
  public width?: number = undefined;
  public minWidth?: number = undefined;
  public height?: number = undefined;
  public minHeight?: number = undefined;

  public children: Panel[] = [];
  public parts: Part[] = [];

  public panelType: PanelType = PanelType.MULTI_LIST;
  public displayInfo: DisplayInfo = new DisplayInfo();
}

export abstract class Perspective {
  public isReact: boolean = false;
  public af_componentId: string;
  public af_perspectiveScreens: string[];
  public af_isDefault: boolean = false;
  public af_isTransient: boolean = true;
  public af_menus?: Menu[] = undefined;
  public af_toolbar?: Toolbar = undefined;

  public af_defaultPanelType: PanelType = PanelType.MULTI_LIST;
  public af_displayInfo: DisplayInfo = new DisplayInfo();

  public af_parts: Part[] = [];
  public af_panels: Panel[] = [];

  public abstract af_perspectiveRoot(root?: { ss: Screen[]; ps: Perspective[] }): Element;

  public af_onStartup(): void {
    // TODO
  }

  public af_onOpen(): void {
    // TODO
  }

  public af_onClose(): void {
    // TODO
  }

  public af_onShutdown(): void {
    // TODO
  }

  public has(screen: Screen | string) {
    const id = typeof screen === "string" ? screen : screen.af_componentId;
    return this.af_perspectiveScreens.indexOf(id) > -1;
  }
}

export abstract class Screen {
  public isReact: boolean = false;
  public af_componentId: string;
  public af_componentTitle?: string;
  public af_componentService: Service = {};
  public af_subscriptions: Subscriptions = {}; // FIXME: Maybe this one should be a method?

  public af_onStartup(): void {
    // FIXME: When to call?
  }

  public af_onOpen(): void {
    // TODO
  }

  public af_onFocus(): void {
    // TODO
  }

  public af_onLostFocus(): void {
    // TODO
  }

  public af_onMayClose(): boolean {
    return true;
  }

  public af_onClose(): void {
    // TODO
  }

  public af_onShutdown(): void {
    // FIXME: When to call?
  }

  public abstract af_componentRoot(root?: { ss: Screen[]; ps: Perspective[] }): Element;

  public static containerId(screen: Screen) {
    return `container-for-screen-${screen.af_componentId}`;
  }
}
