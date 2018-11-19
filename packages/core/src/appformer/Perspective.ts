import { Component, Element } from "../core";

export abstract class Perspective extends Component {
  public af_componentId: string;
  private _af_perspectiveScreens: string[] = [];
  private _af_isDefault: boolean = false;
  private _af_isTransient: boolean = true;
  private _af_isTemplated: boolean = true;

  protected constructor(componentId: string) {
    super({ type: "perspective", core_componentId: componentId });
    this.af_componentId = componentId;
  }

  public core_componentRoot(children?: any): Element {
    return this.af_componentRoot(children);
  }

  public abstract af_componentRoot(children?: any): Element;

  public af_onStartup(): void {
    //
  }

  public af_onOpen(): void {
    //
  }

  public af_onClose(): void {
    //
  }

  public af_onShutdown(): void {
    //
  }

  get af_perspectiveScreens(): string[] {
    return this._af_perspectiveScreens;
  }

  set af_perspectiveScreens(value: string[]) {
    this._af_perspectiveScreens = value;
  }

  get af_isDefault(): boolean {
    return this._af_isDefault;
  }

  set af_isDefault(value: boolean) {
    this._af_isDefault = value;
  }

  get af_isTransient(): boolean {
    return this._af_isTransient;
  }

  set af_isTransient(value: boolean) {
    this._af_isTransient = value;
  }

  get af_isTemplated(): boolean {
    return this._af_isTemplated;
  }

  set af_isTemplated(value: boolean) {
    this._af_isTemplated = value;
  }
}
