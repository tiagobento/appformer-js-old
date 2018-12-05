import { Component as CoreComponent } from "../core";
import { Element } from "../core";

export abstract class Component extends CoreComponent {
  public readonly af_componentId: string;
  public af_subscriptions: Map<string, ((event: any) => void)> = new Map();

  protected constructor(args: { type: string; af_componentId: string }) {
    super({ type: args.type, core_componentId: args.af_componentId });
    this.af_componentId = args.af_componentId;
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
