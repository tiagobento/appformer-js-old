import * as core from '../core'
import React from "react";
import {App} from "./JSComponents";

new core.Clazz();

const one = () => <App number={1}/>;
const two = () => <App number={2}/>;

appformerBridge.registerScreen({
    af_componentId: "A-react-poc-native___examples1",
    af_componentRoot: one,
    af_componentTitle: "First",
    af_onOpen: () => console.info('open!')
});

appformerBridge.registerScreen({
    af_componentId: "A-react-poc-native___examples2",
    af_componentRoot: two,
    af_componentTitle: "Second",
    af_onOpen: () => console.info('open2!')
});
