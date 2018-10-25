import { Component } from "../core";
import { Element } from "../core/Component";

export const DefaultComponentContainerId = "af-js-default-screen-container";

export interface Subscriptions {
  [channel: string]: (event: any) => void;
}

export interface Service {
  [name: string]: any; //FIXME: 'any' is a baaad choice
}

export abstract class Perspective extends Component {
  public af_isDefaultPerspective: boolean;
  public type = "perspective";

  public abstract af_componentRoot(children?: any): Element;

  public core_componentRoot(children?: any): Element {
    return this.af_componentRoot(children);
  }
}

export abstract class Screen extends Component {
  public af_componentTitle?: string;
  public af_componentService: Service = {};
  public af_subscriptions: Subscriptions = {}; // FIXME: Maybe this one should be a method?
  public type = "screen";

  public abstract af_componentRoot(children?: any): Element;

  public core_componentRoot(children?: any): Element {
    return this.af_componentRoot(children);
  }

  public af_onStartup(): void {
    // FIXME: When to call?
  }

  public af_onOpen(): void {
    console.info(`af: OPENED: ${this.af_componentId}`);
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
    console.info(`af: CLOSED: ${this.af_componentId}`);
    // TODO
  }

  public af_onShutdown(): void {
    // FIXME: When to call?
  }
}
