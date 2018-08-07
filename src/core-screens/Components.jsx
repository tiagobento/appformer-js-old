import React from "react";
import {ExampleList} from "../core";

export class DemoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
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
            <div className="react-app-example" style={{padding: "20px"}}>
                <h1>This is a React application</h1>
                <ExampleList name={"Random stuff"} id={this.props.number}/>

                <span>Count: {this.state.count}</span>
                <br/>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.add()}> +</button>
                <button className={"btn btn-primary btn-sm"} onClick={() => this.subtract()}> -</button>

                <input placeholder={"Type here.."}/>

            </div>
        );
    }
}