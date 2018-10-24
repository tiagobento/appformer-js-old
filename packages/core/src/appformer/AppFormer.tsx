import * as React from "react";
import { Element, Component } from "../core/Component";
import { AppFormerRoot } from "./AppFormerRoot";
import { Core } from "../core/Core";
import { Perspective, Screen } from "./Components";

export class AppFormer extends Component {
  private appformerRoot: AppFormerRoot;
  public core: Core;
  public components: Map<string, Component>;

  constructor() {
    super();
    this.isReact = true;
    this.hasContext = true;
    this.af_componentId = "appformer";
    this.core = new Core();
    this.components = new Map();
  }

  public init(container: HTMLElement, callback: () => void) {
    this.core.init(this, container, callback);
    return this;
  }

  public register(component: Screen | Perspective, type: string) {
    this.components.set(component.af_componentId, component);
    this.core.register(component, type);
  }

  public goTo(af_componentId: string) {
    this.appformerRoot.setState({ perspective: af_componentId });
  }

  public open(af_componentId: string) {
    const component = this.components.get(af_componentId);
    if (component) {
      if (component.type === "perspective") {
        this.goTo(component.af_componentId);
      }
      this.core.register(component, component.type);
    }
  }

  public close(af_componentId: string) {
    this.core.deregister(af_componentId);
  }

  public translate(tkey: string, args: string[]) {
    return `Translated ${tkey} with ${args}`;
  }

  public af_componentRoot(portals?: any): Element {
    return <AppFormerRoot appformer={this} exposing={ref => (this.appformerRoot = ref())} portals={portals} />;
  }
}
