import * as React from "react";
import { Perspective } from "./Perspective";
import { Menu, Toolbar } from "./Components";
import { Panel, PanelType } from "./Panel";
import { DisplayInfo } from "./DisplayInfo";
import { Part } from "./Part";
import { Element } from "../core";

export class CompassLayoutPerspective extends Perspective {
  private _af_menus?: Menu[] = undefined;
  private _af_toolbar?: Toolbar = undefined;

  private _af_defaultPanelType: PanelType = PanelType.MULTI_LIST;
  private _af_displayInfo: DisplayInfo = new DisplayInfo();

  private _af_parts: Part[] = [];
  private _af_panels: Panel[] = [];

  protected constructor(componentId: string) {
    super(componentId);
    this.af_isTemplated = false;
  }

  public af_componentRoot(children?: any): Element {
    // TODO: translate compass layout to a templated component
    return <div />;
  }

  get af_menus(): Menu[] | undefined {
    return this._af_menus;
  }

  set af_menus(value: Menu[] | undefined) {
    this._af_menus = value;
  }

  get af_toolbar(): Toolbar | undefined {
    return this._af_toolbar;
  }

  set af_toolbar(value: Toolbar | undefined) {
    this._af_toolbar = value;
  }

  get af_defaultPanelType(): PanelType {
    return this._af_defaultPanelType;
  }

  set af_defaultPanelType(value: PanelType) {
    this._af_defaultPanelType = value;
  }

  get af_displayInfo(): DisplayInfo {
    return this._af_displayInfo;
  }

  set af_displayInfo(value: DisplayInfo) {
    this._af_displayInfo = value;
  }

  get af_parts(): Part[] {
    return this._af_parts;
  }

  set af_parts(value: Part[]) {
    this._af_parts = value;
  }

  get af_panels(): Panel[] {
    return this._af_panels;
  }

  set af_panels(value: Panel[]) {
    this._af_panels = value;
  }
}
