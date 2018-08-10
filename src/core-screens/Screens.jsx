import React from "react";
import {DemoApp} from "./Components";
import {DefaultAppFormerScreen} from "core"

export class InoffensiveNonScreenClass {

}

export class ReactComponentScreen extends DefaultAppFormerScreen {

    constructor() {
        super("AAA-this-is-the-screen-id", "This is a React screen");
        this.af_subscriptions = () => ({
            bang: time => this.onBang(time),
            reverseBang: time => this.onBang(time.split("").reverse().join(""))
        });
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

    af_componentRoot() {
        return <DemoApp number={this.af_componentId} onBang={o => this.onBang = o}/>;
    }

}

export class PureDomElementScreen extends DefaultAppFormerScreen {

    constructor() {
        super("pure-dom-element-screen", "Pure DOM Elements screen");
        this.af_subscriptions = () => ({
            alertEvent: message => alert(message),
        });
    }

    af_componentRoot() {
        const button = document.createElement("button");
        button.textContent = "This is a pure DOM Button element";
        return button;
    }
}

export class StringElementScreen extends DefaultAppFormerScreen {

    constructor() {
        super("string-template-screen", "HTML String screen");
    }

    af_onMayClose() {
        alert("Sorry, this screen is UNCLOSEABLE!");
        return false;
    }

    af_componentRoot() {
        return "\<div\>Hi, i'm a simple pure string template\</div\>";
    }
}

