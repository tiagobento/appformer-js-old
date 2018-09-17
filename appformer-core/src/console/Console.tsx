import * as React from "react";
import {DefaultScreenContainerId, Screen} from "../api";
import {ConsoleDock} from "./ConsoleDock";
import {EventsSimulationConsole} from "./EventsSimulationConsole";

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

export class Console extends React.Component<{ screens: Screen[] }, State> {
  constructor(props: { screens: Screen[] }) {
    super(props);
    this.state = { rpcConsole: false, eventsConsole: false };
  }

  public render() {
    return (
      <div className={"wrapper"}>
        <header id={"container-for-screen-console-header"}>{/*Container*/}</header>

        <div id={DefaultScreenContainerId} className={"main"}>
          {/*Container*/}
        </div>

        <aside className="aside" id={"container-for-screen-console-dock"}>
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
          <EventsSimulationConsole
            screens={this.props.screens}
            onClose={() => this.setState(actions.toggleEventsConsole)}
          />
        </span>
      </div>
    );
  }
}
