import * as React from "react";
import { ExampleList } from "appformer-core";

interface Props {
  number: string;
  onFoo(f: (message: string) => void): void;
}

interface State {
  count: number;
  lastMessage: string;
}

export class DemoReactComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: 0, lastMessage: "No messages were received yet.." };
    this.props.onFoo(message => this.setState({ lastMessage: message }));
  }

  private add() {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  private subtract() {
    this.setState(prevState => ({
      count: Math.max(0, prevState.count - 1)
    }));
  }

  public render() {
    return (
      <div className="react-app-example">
        <ExampleList name={"Random stuff"} id={this.props.number} />

        <span>
          <b>Count: </b>
          {this.state.count}
        </span>
        <br />
        <button className={"btn btn-primary btn-sm"} onClick={() => this.add()}>
          {" "}
          +
        </button>
        <button className={"btn btn-primary btn-sm"} onClick={() => this.subtract()}>
          {" "}
          -
        </button>
        <br />

        <br />
        <span>
          <b>Last Message: </b>
        </span>
        <br />
        <span>{this.state.lastMessage}</span>
        <br />
      </div>
    );
  }
}
