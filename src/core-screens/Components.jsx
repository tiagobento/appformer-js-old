import React from "react";
import {ExampleList} from "../core";

export class DemoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {count: 0, lastBang: "0"};
        this.props.onBang(time => this.setState({lastBang: time}));
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

                <span>Count: {this.state.count}</span>
                <br/>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.add()}> +</button>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.subtract()}> -</button>
                <br/>

                <br/>
                <span>Last bang: {this.state.lastBang}</span>
                <br/>

                <br/>
                <input placeholder={"Type something here.."}/>

            </div>
        );
    }
}