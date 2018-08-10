import React from "react";
import {AppFormer} from "core"
import {DemoApp} from "./Components";

export class InoffensiveNonScreenClass {

}

export class ReactComponentScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "AAA-this-is-the-screen-id";
        this.af_componentTitle = "This is a React screen";
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

export class PureDomElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "pure-dom-element-screen";
        this.af_componentTitle = "Pure DOM Elements screen";
        this.af_subscriptions = () => ({
            alertEvent: message => alert(message),
            bang: message => alert(message),
        });
    }

    af_componentRoot() {
        const button = document.createElement("button");
        button.textContent = "This is a pure DOM Button element";
        return button;
    }
}

export class StringElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "string-template-screen";
        this.af_componentTitle = "HTML String screen";
    }

    af_onMayClose() {
        alert("Sorry, this screen is UNCLOSEABLE!");
        return false;
    }

    af_componentRoot() {
        return "\<div\>Hi, i'm a simple pure string template\</div\>";
    }
}

