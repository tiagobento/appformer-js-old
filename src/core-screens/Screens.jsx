import React from "react";
import {DemoApp} from "./Components";
import {DefaultAppFormerScreen} from "../core"

export class Test {

}

export class FirstScreen extends DefaultAppFormerScreen {

    constructor() {
        super("AAA-this-is-the-screen-id", "This is the screen title");
    }


    af_onOpen() {
        console.info(`Opened ${this.af_componentId} :: ${this.af_componentTitle}`);
    }

    af_onFocus() {
        console.info(`Focused on ${this.af_componentId}`);
        return true;
    }

    af_onLostFocus() {
        console.info(`Lost focus on ${this.af_componentId}`);
        return true;
    }

    // af_onMayClose() {
    //     console.info(`${this.af_componentId} may close..`);
    //     return true;
    // }

    af_componentRoot() {
        return <DemoApp number={this.af_componentId}/>;
    }

}

export class SecondScreen extends DefaultAppFormerScreen {

    constructor() {
        super("AAA-this-is-the-screen-id2", "This is the screen title2");
    }


    af_onOpen() {
        console.info(`Opened ${this.af_componentId} :: ${this.af_componentTitle}`);
    }

    af_onFocus() {
        console.info(`Focused on ${this.af_componentId}`);
        return true;
    }

    af_onLostFocus() {
        console.info(`Lost focus on ${this.af_componentId}`);
        return true;
    }

    // af_onMayClose() {
    //     console.info(`${this.af_componentId} may close..`);
    //     return true;
    // }

    af_componentRoot() {
        return <DemoApp number={this.af_componentId}/>;
    }
}
