import * as React from "react";
import { RootElement, Link, Perspective, Screen } from "appformer-js";

export class ConsoleHeader extends Screen {
  constructor() {
    super("console-header");
    this.isReact = true;
    this.componentTitle = undefined;
  }

  public af_componentRoot(root?: { ss: Screen[]; ps: Perspective[] }): RootElement {
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
        <div>
          <span>
            {root!.ps.map(p => (
              <Link to={p.componentId} key={p.componentId}>
                <button>{p.componentId}</button>
              </Link>
            ))}
          </span>

          <span style={{ color: "white" }}>&nbsp;||&nbsp;</span>

          <span>
            {root!.ss.map(s => (
              <Link to={s.componentId} key={s.componentId}>
                <button>{s.componentId}</button>
              </Link>
            ))}
          </span>
        </div>
      </div>
    );
  }
}
