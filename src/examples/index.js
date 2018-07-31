import * as core from '../core'
import ReactDOM from "react-dom";
import React from "react";
import {App} from "./JSComponents";

new core.Clazz();

export function bootstrapExamples() {

    ReactDOM.render(<App number={core.foo()}/>, window.reactAppContainerElement);

    // alert("Alive!");

    // document.appendChild(core.testComponent());
}

window.reactAppContainerElement =
    window.reactAppContainerElement ||
    document.getElementById("appformer-react-example-root");

window.appformer.examples = bootstrapExamples;

window.appformer.examples();
