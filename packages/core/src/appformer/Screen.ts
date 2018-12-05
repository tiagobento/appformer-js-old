import { Service } from "./Components";
import { Component, Element } from "../core";

export abstract class Screen extends Component {
  public af_componentId: string;
  public af_componentTitle?: string = undefined;
  public af_componentService: Service = {};
  public af_subscriptions: Map<string, ((event: any) => void)> = new Map();

  protected constructor(componentId: string) {
    super({ type: "screen", core_componentId: componentId });
    this.af_componentId = componentId;
  }

  public af_onStartup(): void {
    //
  }

  public af_onOpen(): void {
    //
  }

  public af_onFocus(): void {
    //
  }

  public af_onLostFocus(): void {
    //
  }

  public af_onMayClose(): boolean {
    return true;
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
