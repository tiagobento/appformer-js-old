import { Component } from "../core";
import { Element } from "../core";
import { Screen } from "./Components";

export class ScreenContents extends Component {
  public readonly type = "screen-contents";
  private readonly screen: Screen;

  constructor(screen: Screen) {
    super();
    this.screen = screen;
    this.isReact = screen.isReact;
    this.hasContext = screen.hasContext;
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
