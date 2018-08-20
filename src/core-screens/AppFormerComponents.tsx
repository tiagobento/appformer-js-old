import * as React from "react";
import { AppFormer } from "core";
import DemoApp from "core-screens/DemoApp";
import { TestEvent, Foo } from "generated/Model";
import { Services } from "generated/Services";
import TestMessagesService = Services.org.uberfire.shared.TestMessagesService;

// import homePerspectiveTemplate from "core-screens/HomePerspective.html";
// import otherPerspectiveTemplate from "core-screens/other-perspective.html";

export class InoffensiveNonScreenClass {}

export class ReactComponentScreen extends AppFormer.Screen {
  onFoo: (e: any) => void;

  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "A-react-screen";
    this.af_componentTitle = "React Component";

    this.af_subscriptions = {
      "org.uberfire.shared.TestEvent": (testEvent: TestEvent) => {
        return this.onFoo(
          `An event from server has arrived! "${testEvent.bar}"`
        );
      }
    };

    this.af_componentService = {
      sayHello: TestMessagesService.sayHello,
      sayHelloToSomething: TestMessagesService.sayHelloToSomething,
      sayHelloOnServer: TestMessagesService.sayHelloOnServer,
      fireServerEvent: TestMessagesService.fireServerEvent,
      sendTestPojo: TestMessagesService.sendTestPojo
    };
  }

  af_onStartup() {
    console.info(`Startup ${this.af_componentId}`);
  }

  af_onOpen() {
    const testEvent = new TestEvent({
      bar: "hello1",
      foo: new Foo({ foo: "a" }),
      child: new TestEvent({
        bar: "hello2",
        foo: new Foo({ foo: "b" })
      })
    });

    console.info(
      `[${this.af_componentId}] is open! :: (Starting to make requests..)`
    );

    Promise.resolve()
      .then(() => {
        return this.af_componentService.sayHello();
      })
      .then(msg => {
        console.info(`First call returned (${msg})`);
        return this.af_componentService.sayHelloToSomething("foo");
      })
      .then(msg => {
        console.info(`Second call returned (${msg})`);
        return this.af_componentService.sayHelloOnServer();
      })
      .then(msg => {
        console.info(`Third call returned (${msg})`);
        return this.af_componentService.sendTestPojo(testEvent);
      })
      .then(msg => {
        console.info(`Fourth call returned (${msg})`);
      })
      .catch(e => {
        console.error(e);
      });
  }

  af_onFocus() {
    console.info(`Focused on ${this.af_componentId}`);
  }

  af_onLostFocus() {
    console.info(`Lost focus on ${this.af_componentId}`);
  }

  af_onClose() {
    console.info(`Closed ${this.af_componentId}`);
  }

  af_onShutdown() {
    console.info(`Shut down ${this.af_componentId}`);
  }

  af_componentRoot() {
    const UntypedDemoApp = DemoApp as any;
    return (
      <div>
        <br />
        <button
          className={"btn btn-primary btn-sm"}
          onClick={() => this.af_componentService.fireServerEvent()}
        >
          Click me to make server send an event...
        </button>
        <br />

        <UntypedDemoApp
          number={this.af_componentId}
          onFoo={(x: any) => (this.onFoo = x)}
        />
      </div>
    );
  }
}

export class PureDomElementScreen extends AppFormer.Screen {
  span: HTMLElement;

  constructor() {
    super();
    this.af_componentId = "dom-elements-screen";
    this.af_componentTitle = "DOM Elements Component";
    this.span = document.createElement("span");
    this.af_componentService = {
      fireServerEvent: TestMessagesService.fireServerEvent
    };
  }

  af_onMayClose() {
    return true; //this.span.textContent === "close me!";
  }

  af_componentRoot() {
    const button = document.createElement("button");
    button.textContent = "This is a HTMLButton element";
    button.onclick = e => this.af_componentService.fireServerEvent();

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
    return "<p style=\"color: red\"> Hi, I'm a simple pure HTML String Template</p>";
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
    return <h1>{`This is just an <h1>`}</h1>;
  }
}

// export class HomePerspective extends AppFormer.Perspective {
//
//     constructor() {
//         super();
//         this.af_componentId = "home-perspective";
//         this.af_perspectiveScreens = ["string-template-screen", "A-react-screen"];
//         this.af_isDefaultPerspective = false;
//     }
//
//
//     af_perspectiveRoot() {
//         return homePerspectiveTemplate;
//     }
// }
//
//
//
// export class OtherPerspective extends AppFormer.Perspective {
//
//     constructor() {
//         super();
//         this.af_componentId = "other-perspective";
//         this.af_perspectiveScreens = ["string-template-screen", "dom-elements-screen"];
//         this.af_isDefaultPerspective = false;
//     }
//
//
//     af_perspectiveRoot() {
//         return otherPerspectiveTemplate;
//     }
// }
