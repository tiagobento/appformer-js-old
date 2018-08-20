import { AppFormer } from "core/Components";
import { Link } from "core/react/Shorthands";
import * as React from "react";

export class ConsoleHeader extends AppFormer.Screen {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "console-header";
    this.af_componentTitle = undefined;
  }

  public af_componentRoot(root?: { ss: AppFormer.Screen[]; ps: AppFormer.Perspective[] }): AppFormer.Element {
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
              <Link to={p.af_componentId} key={p.af_componentId}>
                <button>{p.af_componentId}</button>
              </Link>
            ))}
          </span>

          <span style={{ color: "white" }}>&nbsp;||&nbsp;</span>

          <span>
            {root!.ss.map(s => (
              <Link to={s.af_componentId} key={s.af_componentId}>
                <button>{s.af_componentId}</button>
              </Link>
            ))}
          </span>
        </div>
      </div>
    );
  }
}
