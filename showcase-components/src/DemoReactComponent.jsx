import React from "react";
import { ExampleList } from "appformer-core";

export default class DemoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, lastMessage: "No messages were received yet.." };
    this.props.onFoo(message => this.setState({ lastMessage: message }));
  }

  add() {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  subtract() {
    this.setState(prevState => ({
      count: Math.max(0, prevState.count - 1)
    }));
  }

  render() {
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
