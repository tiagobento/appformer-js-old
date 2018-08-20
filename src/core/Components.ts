//
//
//
//
// FIXME: All public API methods need a revision. Their names are *temporary*.

import * as React from "react";

export namespace AppFormer {
  export const DefaultScreenContainerId = "default-container-for-screens";

  export type Subscriptions = { [channel: string]: (event: any) => void };

  export type Service = { [name: string]: any };

  export type Component = Screen | Perspective;

  export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;

  export abstract class Perspective {
    public isReact: boolean = false;
    public af_componentId: string;
    public af_perspectiveScreens: string[];
    public af_isDefaultPerspective: boolean;

    public abstract af_perspectiveRoot(root?: { ss: AppFormer.Screen[]; ps: AppFormer.Perspective[] }): Element;

    public has(screen: AppFormer.Screen | string) {
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

    // FIXME: When to call?
    public af_onStartup(): void {}

    public af_onOpen(): void {}

    public af_onFocus(): void {}

    public af_onLostFocus(): void {}

    public af_onMayClose(): boolean {
      return true;
    }

    public af_onClose(): void {}

    // FIXME: When to call?
    public af_onShutdown(): void {}

    public abstract af_componentRoot(root?: { ss: AppFormer.Screen[]; ps: AppFormer.Perspective[] }): Element;

    public static containerId(screen: AppFormer.Screen) {
      return `container-for-screen-${screen.af_componentId}`;
    }
  }
}
