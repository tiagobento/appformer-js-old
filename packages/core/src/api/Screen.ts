import { RootElement, Service, Subscriptions } from "./Components";
import { Perspective } from "./Perspective";

export abstract class Screen {
  private readonly _af_componentId: string;
  private _af_isReact: boolean = false;
  private _af_componentTitle?: string = undefined;
  private _af_componentService: Service = {};
  private _af_subscriptions: Subscriptions = {}; // FIXME: Maybe this one should be a method?

  protected constructor(componentId: string) {
    this._af_componentId = componentId;
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

  public abstract af_componentRoot(): RootElement;

  public static containerId(af_componentId: string) {
    return `af-js-component--${af_componentId}`;
  }

  get af_componentId(): string {
    return this._af_componentId;
  }

  get af_isReact(): boolean {
    return this._af_isReact;
  }

  set af_isReact(value: boolean) {
    this._af_isReact = value;
  }

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

  get af_subscriptions(): Subscriptions {
    return this._af_subscriptions;
  }

  set af_subscriptions(value: Subscriptions) {
    this._af_subscriptions = value;
  }
}
