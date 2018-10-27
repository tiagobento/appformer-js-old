import * as React from "react";

export abstract class Component {
  public readonly core_componentId: string;
  public readonly type: string;
  public readonly _container: HTMLElement;
  public readonly _components: string[] = [];

  public af_isReact: boolean = false;
  public af_hasContext: boolean = false;

  protected constructor(args: { type: string; core_componentId: string }) {
    this.core_componentId = args.core_componentId;
    this.type = args.type;
  }

  public abstract core_componentRoot(children?: any): Element;

  public core_onReady() {
    console.info(`core: ${this.core_componentId} is ready.`);
  }

  public core_onVanished() {
    console.info(`core: ${this.core_componentId} was removed.`);
  }
}

export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;
