import React from "react";
import {ExampleList} from "../core";

export class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>This is a React application</h1>
                <ExampleList name={"Random stuff"} id={this.props.number}/>
            </div>
        );
    }
}