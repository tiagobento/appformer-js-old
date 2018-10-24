import * as React from "react";
import * as AppFormer from "appformer-js";
import { DefaultComponentContainer, ComponentContainer } from "appformer-js";
import { ConsoleDock } from "./ConsoleDock";
import { EventsSimulationConsole } from "./EventsSimulationConsole";

interface State {
  rpcConsole: boolean;
  eventsConsole: boolean;
}

const actions = {
  toggleRpcConsole: (state: State) => ({ rpcConsole: !state.rpcConsole }),
  toggleEventsConsole: (state: State) => ({
    eventsConsole: !state.eventsConsole
  })
};

export class Console extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { rpcConsole: false, eventsConsole: false };
  }

  public componentDidMount(): void {
    // setTimeout(() => AppFormer.goTo("A-react-screen"), 0);
  }

  public render() {
    return (
      <div className={"wrapper"}>
        <header>
          <ComponentContainer af_componentId={"console-header"} />
        </header>

        <div className={"main"}>
          <DefaultComponentContainer />
          <div af-js-component={"dom-elements-screen"} />
            <div af-js-component={"silly-react-screen"} />
        </div>

        <aside className="aside">
          <ConsoleDock
            status={{ ...this.state }}
            showEvents={() => this.setState(actions.toggleEventsConsole)}
            showRPC={() => this.setState(actions.toggleRpcConsole)}
          />
        </aside>

        <span style={{ gridColumn: "span 6" }} hidden={!this.state.rpcConsole}>
          {/*<RPCConsole screens={this.props.screens} onClose={() => this.setState(actions.toggleRpcConsole)} />*/}
          RPC Console is not working at the moment.
        </span>

        <span style={{ gridColumn: "span 6" }} hidden={!this.state.eventsConsole}>
          <EventsSimulationConsole screens={[]} onClose={() => this.setState(actions.toggleEventsConsole)} />
        </span>
      </div>
    );
  }
}
