import * as React from "react";

export abstract class Component {
  public af_isReact: boolean = false;
  public af_hasContext: boolean = false;
  public readonly af_componentId: string;
  public readonly type: string;

  protected constructor(args: { type: string; af_componentId: string }) {
    this.af_componentId = args.af_componentId;
    this.type = args.type;
  }

  public abstract core_componentRoot(children?: any): Element;

  public core_onReady() {
    console.info(`core: ${this.af_componentId} is ready.`);
  }

  public core_onVanished() {
    console.info(`core: ${this.af_componentId} was removed.`);
  }
}

export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;
