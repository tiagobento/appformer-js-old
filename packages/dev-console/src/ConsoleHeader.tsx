import * as React from "react";
import {
  Screen,
  Element,
  Component,
  CoreRootContextValue,
  AppFormerContext,
  CoreRootContext,
  AppFormerContextValue
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
              {core =>
                Array.from(appformer.api!.components.values())
                  .filter(component => component.type !== "screen-contents")
                  .map(component => (
                    <ToggleButton
                      key={component.core_componentId}
                      component={component}
                      core={core}
                      appformer={appformer}
                    />
                  ))
              }
            </CoreRootContext.Consumer>
          )}
        </AppFormerContext.Consumer>
      </div>
    );
  }
}

class ToggleButton extends React.Component<{
  component: Component;
  core: CoreRootContextValue;
  appformer: AppFormerContextValue;
}> {
  private isOpen(): boolean {
    if (this.props.component.type === "perspective") {
      return this.props.appformer.perspective === this.props.component.core_componentId;
    } else {
      return Boolean(this.props.core.components[this.props.component.core_componentId]);
    }
  }

  private toggle() {
    return this.isOpen()
      ? this.props.appformer.api!.close(this.props.component.core_componentId)
      : this.props.appformer.api!.goTo(this.props.component.core_componentId);
  }

  public render() {
    const opacity = this.isOpen() ? 1 : 0.5;
    return (
      <button style={{ fontSize: "0.7em", opacity }} onClick={() => this.toggle()}>
        {this.props.component.core_componentId}
      </button>
    );
  }
}
