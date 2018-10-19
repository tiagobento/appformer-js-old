import { RootElement, Service, Subscriptions } from "./Components";
import { Perspective } from "./Perspective";

export abstract class Screen {
  private readonly _componentId: string;
  private _isReact: boolean = false;
  private _componentTitle?: string = undefined;
  private _componentService: Service = {};
  private _subscriptions: Subscriptions = {}; // FIXME: Maybe this one should be a method?

  protected constructor(componentId: string) {
    this._componentId = componentId;
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

  public abstract af_componentRoot(root?: { ss: Screen[]; ps: Perspective[] }): RootElement;

  public static containerId(screen: Screen) {
    return `container-for-screen-${screen.componentId}`;
  }

  get componentId(): string {
    return this._componentId;
  }

  get isReact(): boolean {
    return this._isReact;
  }

  set isReact(value: boolean) {
    this._isReact = value;
  }

  get componentTitle(): string | undefined {
    return this._componentTitle;
  }

  set componentTitle(value: string | undefined) {
    this._componentTitle = value;
  }

  get componentService(): Service {
    return this._componentService;
  }

  set componentService(value: Service) {
    this._componentService = value;
  }

  get subscriptions(): Subscriptions {
    return this._subscriptions;
  }

  set subscriptions(value: Subscriptions) {
    this._subscriptions = value;
  }
}
