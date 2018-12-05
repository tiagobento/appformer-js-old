import * as React from "react";
import { Element, Component as CoreComponent, Core } from "../core";
import { AppFormerRoot } from "./AppFormerRoot";
import { ComponentTypes } from "./ComponentTypes";
import { Component } from "./Component";
import { Screen } from "./Screen";
import { ScreenCoreComponent } from "./ScreenCoreComponent";
import { Perspective } from "./Perspective";
import { PerspectiveCoreComponent } from "./PerspectiveCoreComponent";
import { CompassLayoutPerspective } from "./CompassLayoutPerspective";

export class AppFormer extends CoreComponent {
  private appformerRoot: AppFormerRoot;
  public core: Core;
  public components: Map<string, CoreComponent>;

  constructor() {
    super({ type: ComponentTypes.APPFORMER, core_componentId: "appformer" });
    this.af_isReact = true;
    this.af_hasContext = true;
    this.components = new Map();
    this.core = new Core();
  }

  public core_onVanished(): void {
    Array.from(this.components.values()).forEach(component => {
      if (component.type === ComponentTypes.PERSPECTIVE) {
        (component as PerspectiveCoreComponent).perspective.af_onShutdown();
      } else if (component.type === ComponentTypes.SCREEN) {
        (component as ScreenCoreComponent).screen.af_onShutdown();
      }
    });
  }

  public init(container: HTMLElement, callback: () => void) {
    this.core.init(this, container, callback);
    return this;
  }

  public registerScreen(screen: Screen) {
    this.register(screen);
  }

  public registerPerspective(perspective: Perspective) {
    if (perspective instanceof CompassLayoutPerspective) {
      console.warn("Sorry, compass layout perspectives are not supported yet :(");
      return;
    }

    this.register(perspective);
  }

  public register(component: Component) {
    let contents;
    if (component.type === ComponentTypes.PERSPECTIVE) {
      contents = new PerspectiveCoreComponent(component as Perspective, this);
    } else if (component.type === ComponentTypes.SCREEN) {
      contents = new ScreenCoreComponent(component as Screen);
    } else {
      throw new Error("Invalid type");
    }

    this.components.set(contents.core_componentId, contents);
    this.core.register(contents);
    component.af_onStartup();
  }

  public close(af_componentId: string) {
    const component = this.components.get(af_componentId);
    if (component) {
      if (component.type === ComponentTypes.SCREEN) {
        if ((component as ScreenCoreComponent).screen.af_onMayClose()) {
          this.core.deregister(af_componentId);
        }
      }
    }
  }

  public goTo(af_componentId: string, args?: any) {
    const component = this.components.get(af_componentId);
    if (!component) {
      return;
    }

    if (component.type === ComponentTypes.PERSPECTIVE) {
      this.appformerRoot.setState({ perspective: component.core_componentId });
    } else if (component.type === ComponentTypes.SCREEN) {
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
