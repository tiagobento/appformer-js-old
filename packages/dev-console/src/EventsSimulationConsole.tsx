import * as React from "react";
import { Screen } from "appformer-js";

interface Props {
  screens: Screen[];
  onClose: () => void;
}

interface State {
  event: string;
  channel?: string;
}

const actions = {
  setChannel: (c: string) => (state: State) => ({ channel: c }),
  setEvent: (e: string) => (state: State) => ({ event: e })
};

export class EventsSimulationConsole extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      event: "",
      channel:
        Object.keys(this.subscriptions())
          .sort()
          .pop() || undefined
    };
  }

  public subscriptions(props = this.props) {
    return new Map();
  }

  private sendEvent() {
    if (this.state.channel) {
      try {
        const parse = JSON.parse(this.state.event);
        this.subscriptions().get(this.state.channel!)(parse);
      } catch (e) {
        console.info(`Invalid event [${this.state.event}]`);
      }
    }
  }

  public render() {
    return (
      <div>
        <div className={"title"}>
          <span>Events simulation console</span>
          &nbsp;
          <a href={"#"} onClick={() => this.props.onClose()}>
            Close
          </a>
        </div>

        <div>
          {(this.state.channel && (
            <>
              <select
                style={{ width: "100%" }}
                value={this.state.channel}
                onChange={e => this.setState(actions.setChannel(e.target.value))}
              >
                {Object.keys(this.subscriptions())
                  .sort()
                  .map(channel => {
                    return (
                      <option key={channel} value={channel}>
                        {channel}
                      </option>
                    );
                  })}
              </select>

              <br />
              <br />
              <button onClick={() => this.sendEvent()}>Send event!</button>
              <br />
              <br />

              <textarea
                onChange={e => this.setState(actions.setEvent(e.target.value))}
                placeholder={"Type JSON here..."}
                value={this.state.event}
              />
            </>
          )) || (
            <>
              <span>No one is listening to events at the moment :(</span>
            </>
          )}
        </div>
      </div>
    );
  }
}
