import React from "react";
import {AppFormer} from "core"
import {DemoApp} from "./Components";

export class InoffensiveNonScreenClass {

}

export class ReactComponentScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "AAA-this-is-the-screen-id";
        this.af_componentTitle = "React Component";
        this.af_subscriptions = () => ({
            fooMessage: message => this.onFoo(message),
            reverseFooMessage: message => this.onFoo(message.split("").reverse().join(""))
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
        return <DemoApp number={this.af_componentId} onFoo={o => this.onFoo = o}/>;
    }

}

export class PureDomElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "pure-dom-element-screen";
        this.af_componentTitle = "Pure DOM Elements Component";
        this.span = document.createElement("span");
        this.af_subscriptions = () => ({
            popupEvent: message => alert(message),
            fooMessage: message => this.span.textContent = message,
        });
    }

    af_componentRoot() {
        const button = document.createElement("button");
        button.textContent = "This is a pure DOM Button element";

        const label = document.createElement("label");
        label.textContent = "This is also a Foo Message: ";

        const div = document.createElement("div");
        div.appendChild(button);
        div.appendChild(document.createElement("br"));
        div.appendChild(label);
        div.appendChild(this.span);
        return div;
    }
}

export class StringElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "string-template-screen";
        this.af_componentTitle = "Pure HTML String Component";
        this.af_subscriptions = () => {};
    }

    af_onMayClose() {
        alert("Sorry, this screen is UNCLOSEABLE!");
        return false;
    }

    af_componentRoot() {
        return "Hi, i'm a simple pure string template";
    }
}

