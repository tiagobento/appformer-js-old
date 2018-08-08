import React from "react";
import * as core from "core"
import * as screens from "./Screens";

//This is here just as a sanity check.
new core.Clazz();

//Registers the AppFormer components.
export function init() {
    core.register(screens);
}

init();

