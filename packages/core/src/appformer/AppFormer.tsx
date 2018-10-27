import * as React from "react";
import { AppFormerRoot } from "./AppFormerRoot";
import { Element, Component, Core } from "../core";
import { ScreenEnvelope } from "./ScreenEnvelope";
import { ScreenContents } from "./ScreenContents";
import { Perspective } from "./Perspective";
import { Screen } from "./Screen";

export class AppFormer extends Component {
  private appformerRoot: AppFormerRoot;
  public core: Core;
  public components: Map<string, Component>;

  constructor() {
    super({ type: "appformer", core_componentId: "appformer" });
    this.af_isReact = true;
    this.af_hasContext = true;
    this.components = new Map();
    this.core = new Core();
  }

  public init(container: HTMLElement, callback: () => void) {
    this.core.init(this, container, callback);
    return this;
  }

  public registerScreen(screen: Screen) {
    const envelope = new ScreenEnvelope(screen);
    const contents = new ScreenContents(screen);

    this.components.set(envelope.core_componentId, envelope);
    this.components.set(contents.core_componentId, contents);

    this.core.register(envelope);
    this.core.register(contents);

    screen.af_onStartup();
  }

  public registerPerspective(perspective: Perspective) {
    this.components.set(perspective.core_componentId, perspective);
    this.core.register(perspective);
  }

  public close(af_componentId: string) {
    const component = this.components.get(af_componentId);
    if (component) {
      if (component.type === "screen-envelope") {
        if ((component as ScreenEnvelope).screen.af_onMayClose()) {
          this.core.deregister(af_componentId);
        }
      }
    }
  }

  public goTo(af_componentId: string) {
    const component = this.components.get(af_componentId);
    if (!component) {
      return;
    }

    if (component.type === "perspective") {
      this.appformerRoot.setState({ perspective: component.core_componentId });
    } else if (component.type === "screen-envelope") {
      this.core.register(component);
    }
  }

  public translate(tkey: string, args: string[]) {
    return `Translated ${tkey} with ${args}`;
  }

  public render(element: Element, container: HTMLElement, callback = (): void => undefined) {
    this.core.render(element, container, callback);
  }

  public fireEvent(obj: any) {
    console.info("Firing event: " + obj);
  }

  public rpc(path: string, args: any[]): Promise<string> {
    return Promise.reject("Sorry, RPC mocks are not available yet :(");
  }

  public core_componentRoot(portals?: any): Element {
    return <AppFormerRoot appformer={this} exposing={ref => (this.appformerRoot = ref())} portals={portals} />;
  }
}
