import * as React from "react";
import { AppFormer } from "core/Components";

interface Props {
  screens: AppFormer.Screen[];
  onClose: () => void;
}

export class RPCConsole extends React.Component<Props, {}> {
  private getMethods() {
    const concat = (x: any, y: any) => x.concat(y);

    const methods = (this.props.screens as any)
      .map((screen: any) => {
        const service = screen.af_componentService;

        const AF = (window as any).appformer;
        const originalRPC = AF.RPC;

        // monkey patch 🙊🙉🙈
        AF.RPC = function(methodSignature: any, json: any[]) {
          return methodSignature;
        };

        const methods = Object.keys(service).map(x =>
          (service[x] as any)({
            __toErraiBusObject: () => ({
              __toJson() {
                // noop
              }
            })
          })
        );
        AF.RPC = originalRPC;
        return methods;
      })
      .reduce(concat, []);

    return methods.filter((a: any, b: number) => methods.indexOf(a) === b);
  }

  public render() {
    return (
      <div>
        <div className={"title"}>
          <span>RPC simulation console</span>
          &nbsp;
          <a href={"#"} onClick={() => this.props.onClose()}>
            Close
          </a>
        </div>

        <div>
          <select style={{ width: "100%" }}>
            {this.getMethods().map((method: string) => {
              return (
                <option key={method} value={method}>
                  {method}
                </option>
              );
            })}
          </select>

          <br />
          <br />
          <span>Mocked return:</span>
          <br />
          <textarea placeholder={"Type JSON here..."} />
        </div>
      </div>
    );
  }
}
