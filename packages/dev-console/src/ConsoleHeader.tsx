import * as React from "react";
import * as AppFormer from "appformer-js";

export class ConsoleHeader extends AppFormer.Screen {
  constructor() {
    super("console-header");
    this.af_isReact = true;
    this.af_componentTitle = undefined;
  }

  private isOpen(screen: AppFormer.Screen, rootContext: AppFormer.RootContextValue) {
      return rootContext.openScreens.indexOf(screen) !== -1;
  }

  public af_componentRoot(): AppFormer.RootElement {
    return (
      <AppFormer.RootContext.Consumer>
        {rootContext => (
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
            <div>
              <span>
                {rootContext.perspectives.map(p => (
                  <AppFormer.Link to={p.af_componentId} key={p.af_componentId}>
                    <button style={{ opacity: p === rootContext.currentPerspective ? 1 : 0.5 }}>{p.af_componentId}</button>
                  </AppFormer.Link>
                ))}
              </span>

              <span style={{ color: "white" }}>&nbsp;||&nbsp;</span>

              <span>
                {rootContext.screens.map(s => (
                  <AppFormer.Link to={s.af_componentId} key={s.af_componentId}>
                    <button style={{ opacity: this.isOpen(s, rootContext) ? 1 : 0.5 }}>{s.af_componentId}</button>
                  </AppFormer.Link>
                ))}
              </span>
            </div>
          </div>
        )}
      </AppFormer.RootContext.Consumer>
    );
  }
}
