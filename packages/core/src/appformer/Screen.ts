import { Service } from "./Components";
import { Component, Element } from "../core";

export abstract class Screen extends Component {
  public af_componentId: string;
  private _af_componentTitle?: string = undefined;
  private _af_componentService: Service = {};
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

  get af_componentTitle(): string | undefined {
    return this._af_componentTitle;
  }

  set af_componentTitle(value: string | undefined) {
    this._af_componentTitle = value;
  }

  get af_componentService(): Service {
    return this._af_componentService;
  }

  set af_componentService(value: Service) {
    this._af_componentService = value;
  }
}
