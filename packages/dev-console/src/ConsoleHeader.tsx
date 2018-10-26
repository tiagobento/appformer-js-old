import * as React from "react";
import {
  Screen,
  Element,
  Component,
  CoreRootContextValue,
  AppFormerContext,
  CoreRootContext,
  AppFormerContextValue,
} from "appformer-js";

export class ConsoleHeader extends Screen {
  constructor() {
    super("console-header");
    this.af_isReact = true;
    this.af_componentTitle = undefined;
  }

  public af_onMayClose(): boolean {
    return false;
  }

  private isOpen(component: Component, core: CoreRootContextValue, appformer: AppFormerContextValue): any {
    if (component.type === "perspective") {
      return appformer.perspective === component.af_componentId;
    } else {
      return Object.keys(core.components).indexOf(component.af_componentId) !== -1;
    }
  }

  private toggle(c: Component, core: CoreRootContextValue, appformer: AppFormerContextValue) {
    return this.isOpen(c, core, appformer)
      ? appformer.api!.close(c.af_componentId)
      : appformer.api!.goTo(c.af_componentId);
  }

  public af_componentRoot(): Element {
    return (
      <div
        style={{
          height: "50px",
          backgroundColor: "#333",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          padding: "0 10px 0 10px"
        }}
      >
        <AppFormerContext.Consumer>
          {appformer => (
            <CoreRootContext.Consumer>
              {core => (
                <>
                  {Array.from(appformer.api!.components.values())
                    .filter(c => c.type !== "screen-contents")
                    .map(c => this.ToggleButton({ c, core, appformer }))}
                </>
              )}
            </CoreRootContext.Consumer>
          )}
        </AppFormerContext.Consumer>
      </div>
    );
  }

  private ToggleButton(props: { c: Component; core: CoreRootContextValue; appformer: AppFormerContextValue }) {
    return (
      <button
        style={{
          fontSize: "0.7em",
          opacity: this.isOpen(props.c, props.core, props.appformer) ? 1 : 0.5
        }}
        onClick={() => this.toggle(props.c, props.core, props.appformer)}
        key={props.c.af_componentId}
      >
        {props.c.af_componentId}
      </button>
    );
  }
}
