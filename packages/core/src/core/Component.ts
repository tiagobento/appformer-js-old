import * as React from "react";

export abstract class Component {
  public af_componentId: string;
  public isReact: boolean = false;
  public hasContext: boolean = false;
  public readonly type: string;

  public abstract af_componentRoot(children?: any): Element;

  public core_onReady() {
    console.info(`core: ${this.af_componentId} is ready.`);
  }

  public core_onVanished() {
    console.info(`core: ${this.af_componentId} was removed.`);
  }
}

export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;
