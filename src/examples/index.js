import * as core from '../core'
import ReactDOM from "react-dom";
import React from "react";
import {OtherList} from "./JSComponents";

new core.Clazz();

ReactDOM.render(<OtherList number={core.foo()}/>,
    document.getElementById("root"));

document.appendChild(core.testComponent());
