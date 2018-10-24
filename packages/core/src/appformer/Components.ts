//
//
//
//
// FIXME: All public API methods need a revision. Their names are *temporary*.

import { Component } from "../core";

export const DefaultComponentContainerId = "af-js-default-screen-container";

export interface Subscriptions {
  [channel: string]: (event: any) => void;
}

export interface Service {
  [name: string]: any; //FIXME: 'any' is a baaad choice
}

export abstract class Perspective extends Component {
  public af_isDefaultPerspective: boolean;

    constructor() {
        super();
        this.type = "perspective";
    }
}

export abstract class Screen extends Component {
  public af_componentTitle?: string;
  public af_componentService: Service = {};
  public af_subscriptions: Subscriptions = {}; // FIXME: Maybe this one should be a method?

  constructor() {
    super();
    this.type = "screen";
  }

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
}
