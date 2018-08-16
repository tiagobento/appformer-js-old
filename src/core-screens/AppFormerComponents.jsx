import React from "react";
import {AppFormer, RPC} from "core"
import DemoApp from "core-screens/DemoApp";
import homePerspectiveTemplate from "core-screens/HomePerspective.html";
import otherPerspectiveTemplate from "core-screens/other-perspective.html";

export class InoffensiveNonScreenClass {

}

export class ReactComponentScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "A-react-screen-id";
        this.af_componentTitle = "React Component";

        this.af_subscriptions = {
            "org.uberfire.shared.TestEvent": (testEvent) => {
                return this.onFoo(`An event from server has arrived! "${testEvent.foo}"`);
            },
        };

        this.af_componentService = {
            sayHello: () => RPC("org.uberfire.shared.TestMessagesService|hello", []),
            sayHelloToFoo: (something) => RPC("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [something]), // <- String does not need marshalling
            sayHelloOnServer: () => RPC("org.uberfire.shared.TestMessagesService|muteHello", []),
            fireServerEvent: () => RPC("org.uberfire.shared.TestMessagesService|helloFromEvent", []),
            sendTestEvent: (test) => RPC("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [JSON.stringify(test)]),
        };
    }

    af_onOpen() {
        console.info(`[${this.af_componentId}] is open! :: (Starting to make requests..)`);

        Promise.resolve().then(() => {
            return this.af_componentService.sayHello();
        }).then(msg => {
            console.info(`First call returned (${msg})`);
            return this.af_componentService.sayHelloToFoo("foo");
        }).then(msg => {
            console.info(`Second call returned (${msg})`);
            return this.af_componentService.sayHelloOnServer();
        }).then(msg => {
            console.info(`Third call returned (${msg})`);
            return this.af_componentService.sendTestEvent({
                "^EncodedType": "org.uberfire.shared.TestEvent",
                "^ObjectID": "1",
                foo: "hello1",
                child: {
                    "^EncodedType": "org.uberfire.shared.TestEvent",
                    "^ObjectID": "2",
                    foo: "hello2",
                    child: null
                }
            });
        }).then(msg => {
            console.info(msg);
            console.info(`Fourth call returned (${msg})`);
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
        return <div>

            <br/>
            <button className={"btn btn-primary btn-sm"}
                    onClick={() => this.af_componentService.fireServerEvent()}>
                Click me to make server send an event...
            </button>
            <br/>

            <DemoApp number={this.af_componentId} onFoo={o => this.onFoo = o}/>
        </div>;
    }

}

export class PureDomElementScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.af_componentId = "dom-elements-screen";
        this.af_componentTitle = "DOM Elements Component";
        this.span = document.createElement("span");
        this.af_subscriptions = {
            // "popupEvent": message => alert(message),
            // "fooMessage": message => this.span.textContent = message,
        };
    }

    af_onMayClose() {
        return true; //this.span.textContent === "close me!";
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
    }

    af_onMayClose() {
        return true;
    }

    af_componentRoot() {
        return '<p style="color: red"> Hi, I\'m a simple pure HTML String Template</p>';
    }
}

export class SillyReactScreen extends AppFormer.Screen {

    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "silly-react-screen";
        this.af_componentTitle = "Silly React Component";
    }

    af_componentRoot() {
        return <h1>{`This is just an <h1>`}</h1>
    }
}

export class HomePerspective extends AppFormer.Perspective {

    constructor() {
        super();
        this.af_componentId = "home-perspective";
        this.af_perspectiveScreens = ["string-template-screen", "A-react-screen-id"];
        this.af_isDefaultPerspective = false;
    }

    af_perspectiveRoot() {
        return homePerspectiveTemplate;
    }
}


export class OtherPerspective extends AppFormer.Perspective {

    constructor() {
        super();
        this.af_componentId = "other-perspective";
        this.af_perspectiveScreens = ["string-template-screen", "dom-elements-screen"];
        this.af_isDefaultPerspective = false;
    }

    af_perspectiveRoot() {
        return otherPerspectiveTemplate;
    }
}

