import * as React from "react";
import { AppFormer } from "./AppFormer";

interface Props {
  exposing: (ref: () => AppFormerRoot) => void;
  appformer: AppFormer;
  portals: any;
}

interface State {
  perspective?: string;
}

export interface AppFormerContextValue extends State {
  api?: AppFormer;
}

export const AppFormerContext = React.createContext<AppFormerContextValue>({
  perspective: undefined,
  api: undefined
});

export class AppFormerRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.exposing(() => this);
    this.state = { perspective: undefined };
  }

  public render() {
    return (
      <div className={"appformer-root"}>
        <AppFormerContext.Provider value={{ ...this.state, api: this.props.appformer }}>
          <div key={this.state.perspective!} af-js-component={this.state.perspective!} />
          {this.props.portals}
        </AppFormerContext.Provider>
      </div>
    );
  }
}
