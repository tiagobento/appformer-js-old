import * as React from "react";
import { AppFormer } from "core/Components";
import ConsoleDock from "core/console/ConsoleDock";
import EventsSimulationConsole from "core/console/EventsSimulationConsole";
import { RPCConsole } from "core/console/RpcSimulationConsole";

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

export default class Console extends React.Component<{ screens: AppFormer.Screen[] }, State> {
  constructor(props: { screens: AppFormer.Screen[] }) {
    super(props);
    this.state = { rpcConsole: false, eventsConsole: false };
  }

  render() {
    return (
      <div className={"wrapper"}>
        <header id={"container-for-screen-console-header"}>{/*Container*/}</header>

        <div id={AppFormer.DefaultScreenContainerId} className={"main"}>
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
          <RPCConsole screens={this.props.screens} onClose={() => this.setState(actions.toggleRpcConsole)} />
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
