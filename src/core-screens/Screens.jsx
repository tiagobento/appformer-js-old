import React from "react";
import {AppFormer, get} from "core"
import {DemoApp} from "./Components";

export class InoffensiveNonScreenClass {

}

export class ReactComponentScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "AAA-this-is-the-screen-id";
        this.af_componentTitle = "React Component";
        this.af_subscriptions = () => ({
            "fooMessage": message => this.onFoo(message),
            "reverseFooMessage": message => this.onFoo(message.split("").reverse().join(""))
        });
    }

    af_onOpen() {
        console.info(`Opened ${this.af_componentId} :: ${this.af_componentTitle} (Starting to make requests..)`);

        Promise.resolve().then(() => {
            return get("org.uberfire.shared.MessageService|hello", []);
        }).then(msg => {
            console.info(`First call returned (${msg})`);
            return get("org.uberfire.shared.MessageService|hello:java.lang.String", ["foo"]);
        }).then(msg => {
            console.info(`Second call returned (${msg})`);
            return get("org.uberfire.shared.MessageService|muteHello", []);
        }).then(msg => {
            console.info(`Third call returned (${msg})`);
        }).catch(e => {
            console.error(e);
        });
    }

    af_onFocus() {
        console.info(`Focused on ${this.af_componentId}`);
    }

    af_onLostFocus() {
        console.info(`Lost focus on ${this.af_componentId}`);
    }

    af_componentRoot() {
        return <DemoApp number={this.af_componentId} onFoo={o => this.onFoo = o}/>;
    }

}

export class PureDomElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "dom-elements-screen";
        this.af_componentTitle = "DOM Elements Component";
        this.span = document.createElement("span");
        this.af_subscriptions = () => ({
            "popupEvent": message => alert(message),
            "fooMessage": message => this.span.textContent = message,
        });
    }

    af_componentRoot() {
        const button = document.createElement("button");
        button.textContent = "This is a HTMLButton element";

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
        this.af_subscriptions = () => {
        };
    }

    af_onMayClose() {
        alert("Sorry, this screen is UNCLOSEABLE!");
        return false;
    }

    af_componentRoot() {
        return "Hi, i'm a simple pure string template";
    }
}

