import { Component } from "../core";
import { Element } from "../core";
import {Screen} from "./Screen";

export class ScreenContents extends Component {
  public readonly type = "screen-contents";
  private readonly screen: Screen;

  constructor(screen: Screen) {
    super();
    this.screen = screen;
    this.af_isReact = screen.af_isReact;
    this.af_hasContext = screen.af_hasContext;
    this.af_componentId = screen.af_componentId + "-contents";
  }

  public core_onReady(): void {
    this.screen.af_onOpen();
  }

  public core_onVanished(): void {
    this.screen.af_onClose();
  }

  public core_componentRoot(children?: any): Element {
    return this.screen.af_componentRoot(children);
  }
}
