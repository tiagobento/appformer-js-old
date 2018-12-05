import { Component, Element } from "../core";

export abstract class Perspective extends Component {
  public af_componentId: string;
  public af_name: string;
  public af_perspectiveScreens: string[] = [];
  public af_isDefault: boolean = false;
  public af_isTransient: boolean = true;
  public af_isTemplated: boolean = true;

  protected constructor(componentId: string) {
    super({ type: "perspective", core_componentId: componentId });
    this.af_componentId = componentId;
  }

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

  public core_componentRoot(children?: any): Element {
    return this.af_componentRoot(children);
  }

  public abstract af_componentRoot(children?: any): Element;
}
