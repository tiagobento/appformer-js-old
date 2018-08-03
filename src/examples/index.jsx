import * as core from '../core'
import React from "react";
import {App} from "./JSComponents";

new core.Clazz();

const one = () => <App number={1}/>;
const two = () => <App number={2}/>;

appformerBridge.registerScreen({
    id: "A-react-poc-native___examples1",
    init: one,
    title: "First",
    on_open: () => alert('open!')
});

appformerBridge.registerScreen({
    id: "A-react-poc-native___examples2",
    init: two,
    title: "Second",
    on_open: () => alert('open2!')
});
