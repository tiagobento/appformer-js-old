import * as React from "react";
import * as AppFormer from "appformer-js";

export class ConsoleHeader extends AppFormer.Screen {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "console-header";
  }

  public af_componentRoot(): AppFormer.Element {
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
        <AppFormer.AppFormerContext.Consumer>
          {appformer => (
            <>
              <AppFormer.CoreRootContext.Consumer>
                {core =>
                  Array.from(appformer.api!.components.values()).map(c => (
                    <button
                      style={{ opacity: Object.keys(core.components).indexOf(c.af_componentId) !== -1 ? 1 : 0.5 }}
                      onClick={() => appformer.api!.open(c.af_componentId)}
                      key={c.af_componentId}
                    >
                      {c.af_componentId}
                    </button>
                  ))
                }
              </AppFormer.CoreRootContext.Consumer>
              <h1 style={{ float: "right" }} color={"red"}>
                {appformer.perspective}
              </h1>
            </>
          )}
        </AppFormer.AppFormerContext.Consumer>
      </div>
    );
  }
}
