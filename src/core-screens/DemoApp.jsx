import React from "react";
import {ExampleList} from "core";

export default class DemoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {count: 0, lastFooMessage: "0"};
        this.props.onFoo(message => this.setState({lastFooMessage: message}));
    }

    add() {
        this.setState((prevState) => ({
            count: prevState.count + 1
        }));
    }

    subtract() {
        this.setState((prevState) => ({
            count: Math.max(0, prevState.count - 1)
        }));
    }

    render() {
        return (
            <div className="react-app-example">

                <ExampleList name={"Random stuff"} id={this.props.number}/>

                <span><b>Count: </b>{this.state.count}</span>
                <br/>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.add()}> +</button>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.subtract()}> -
                </button>
                <br/>

                <br/>
                <span><b>Last Foo Message (or reversed): </b></span>
                <br/>
                <span>{this.state.lastFooMessage}</span>
                <br/>

            </div>
        );
    }
}