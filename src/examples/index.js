import * as core from '../core'
import ReactDOM from "react-dom";
import React from "react";
import {App} from "./JSComponents";

new core.Clazz();

ReactDOM.render(<App number={core.foo()}/>,
    document.getElementById("appformer-example-root"));

document.appendChild(core.testComponent());
