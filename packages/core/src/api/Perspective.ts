import { Screen } from "./Screen";
import { Menu, Toolbar, RootElement } from "./Components";
import { Panel, PanelType } from "./Panel";
import { DisplayInfo } from "./DisplayInfo";
import { Part } from "./Part";

export abstract class Perspective {
  private readonly _componentId: string;
  private _isReact: boolean = false;
  private _perspectiveScreens: string[] = [];
  private _isDefault: boolean = false;
  private _isTransient: boolean = true;
  private _menus?: Menu[] = undefined;
  private _toolbar?: Toolbar = undefined;

  private _defaultPanelType: PanelType = PanelType.MULTI_LIST;
  private _displayInfo: DisplayInfo = new DisplayInfo();

  private _parts: Part[] = [];
  private _panels: Panel[] = [];

  protected constructor(componentId: string) {
    this._componentId = componentId;
  }

  public abstract af_perspectiveRoot(root?: { ss: Screen[]; ps: Perspective[] }): RootElement;

  public af_onStartup(): void {
    // TODO
  }

  public af_onOpen(): void {
    // TODO
  }

  public af_onClose(): void {
    // TODO
  }

  public af_onShutdown(): void {
    // TODO
  }

  public has(screen: Screen | string) {
    const id = typeof screen === "string" ? screen : screen.componentId;
    return this.perspectiveScreens.indexOf(id) > -1;
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

  get perspectiveScreens(): string[] {
    return this._perspectiveScreens;
  }

  set perspectiveScreens(value: string[]) {
    this._perspectiveScreens = value;
  }

  get isDefault(): boolean {
    return this._isDefault;
  }

  set isDefault(value: boolean) {
    this._isDefault = value;
  }

  get isTransient(): boolean {
    return this._isTransient;
  }

  set isTransient(value: boolean) {
    this._isTransient = value;
  }

  get menus(): Menu[] | undefined {
    return this._menus;
  }

  set menus(value: Menu[] | undefined) {
    this._menus = value;
  }

  get toolbar(): Toolbar | undefined {
    return this._toolbar;
  }

  set toolbar(value: Toolbar | undefined) {
    this._toolbar = value;
  }

  get defaultPanelType(): PanelType {
    return this._defaultPanelType;
  }

  set defaultPanelType(value: PanelType) {
    this._defaultPanelType = value;
  }

  get displayInfo(): DisplayInfo {
    return this._displayInfo;
  }

  set displayInfo(value: DisplayInfo) {
    this._displayInfo = value;
  }

  get parts(): Part[] {
    return this._parts;
  }

  set parts(value: Part[]) {
    this._parts = value;
  }

  get panels(): Panel[] {
    return this._panels;
  }

  set panels(value: Panel[]) {
    this._panels = value;
  }
}
