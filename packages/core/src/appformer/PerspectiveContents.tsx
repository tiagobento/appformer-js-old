import { Component } from "../core";
import { Element } from "../core";
import { Perspective } from "./Perspective";
import { AppFormer } from "./AppFormer";
import { ComponentTypes } from "./ComponentTypes";

export class PerspectiveContents extends Component {
  private readonly perspective: Perspective;
  private readonly appformer: AppFormer;

  constructor(perspective: Perspective, appformer: AppFormer) {
    super({ type: ComponentTypes.PERSPECTIVE_CONTENTS, core_componentId: perspective.af_componentId + "-contents" });
    this.perspective = perspective;
    this.appformer = appformer;
    this.af_isReact = perspective.af_isReact;
    this.af_hasContext = perspective.af_hasContext;
  }

  //FIXME: Execute goTo for all _components at once. This will speed up React's reconciliation
  //FIXME: by changing the state only once.
  public core_onReady(): void {
    this._components.forEach(id => this.appformer.goTo(id));
    this.perspective.af_onOpen();
  }

  public core_onVanished(): void {
    this.perspective.af_onClose();
  }

  public core_componentRoot(children?: any): Element {
    return this.perspective.af_componentRoot(children);
  }
}
