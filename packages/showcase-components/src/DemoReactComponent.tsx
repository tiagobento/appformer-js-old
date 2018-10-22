import * as React from "react";
import { __i18n, Link } from "appformer-js";

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


class ExampleList extends React.Component<
    {
        name: string;
        id: string;
    },
    {}
    > {
    public render() {
        return (
            <div>
                <h4>List of {this.props.name}</h4>
                <ul>
                    <li>Id: {this.props.id}</li>
                    <li>
                        <__i18n tkey={"message.that.should.be.translated"} args={[]} />
                    </li>
                    <li>
                        Oculus (and
                        <Link to={"TodoListScreen"}>
                            &nbsp;
                            <a href="#">link</a>
                            &nbsp;
                        </Link>
                        to the TodoListScreen!)
                    </li>
                    <li>
                        <Link to={"dom-elements-screen"}>
                            <a href="#">Open DOM Elements screen</a>
                            &nbsp;
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}
