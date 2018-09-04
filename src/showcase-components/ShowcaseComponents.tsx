import * as React from "react";
import * as AppFormer from "appformer";
import ShowcaseReactComponent from "showcase-components/DemoReactComponent";
import { Foo, TestEvent } from "generated__temporary__/Model";
import TestMessagesService from "generated__temporary__/org/uberfire/shared/TestMessagesService";
// import ObeservablePathImpl from "uberfire-api/org/uberfire/backend/vfs/impl/ObservablePathImpl";

// import homePerspectiveTemplate from "showcase-components/HomePerspective.html";
// import otherPerspectiveTemplate from "showcase-components/other-perspective.html";

export class InoffensiveNonScreenClass {}

enum Asd {
  A2
}

export class ReactComponentScreen extends AppFormer.Screen {
  public onFoo: (e: any) => void;

  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "A-react-screen";
    this.af_componentTitle = "React Component";

    this.af_subscriptions = {
      "org.uberfire.shared.TestEvent": (testEvent: TestEvent) => {
        return this.onFoo(`An event from server has arrived! "${testEvent.bar}"`);
      }
    };

    // new ObeservablePathImpl({}).path;

    // const servce = new TestMessagesService();
    // const drlTextLends = new GlobalsEditorService();
    // const MyPathImpl = class implements Path {
    //     public readonly path: string;
    //     constructor(s: string) {
    //         this.path = s;
    //     }
    // };
    //
    // drlTextLends.loadContent({ path: new MyPathImpl("/tmp/test") }).then(e => {
    //   console.info(e);
    // });
    //
    // this.af_componentService = {
    //   sayHello: servce.sayHello,
    //   sayHelloToSomething: servce.sayHelloToSomething,
    //   sayHelloOnServer: servce.sayHelloOnServer,
    //   fireServerEvent: servce.fireServerEvent,
    //   sendTestPojo: servce.sendTestPojo
    // };
  }

  public af_onStartup() {
    console.info(`Startup ${this.af_componentId}`);
  }

  public af_onOpen() {
    const testEvent = new TestEvent({
      bar: "hello1",
      foo: new Foo({ foo: "a" }),
      child: new TestEvent({
        bar: "hello2",
        foo: new Foo({ foo: "b" })
      })
    });

    console.info(`[${this.af_componentId}] is open! :: (Starting to make requests..)`);

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

  public af_onFocus() {
    console.info(`Focused on ${this.af_componentId}`);
  }

  public af_onLostFocus() {
    console.info(`Lost focus on ${this.af_componentId}`);
  }

  public af_onClose() {
    console.info(`Closed ${this.af_componentId}`);
  }

  public af_onShutdown() {
    console.info(`Shut down ${this.af_componentId}`);
  }

  public af_componentRoot() {
    const Component = ShowcaseReactComponent as any;
    return (
      <div>
        <br />
        <button className={"btn btn-primary btn-sm"} onClick={() => this.af_componentService.fireServerEvent()}>
          Click me to make server send an event...
        </button>
        <br />

        <Component number={this.af_componentId} onFoo={(x: any) => (this.onFoo = x)} />
      </div>
    );
  }
}

export class PureDomElementScreen extends AppFormer.Screen {
  public span: HTMLElement;

  constructor() {
    super();
    this.af_componentId = "dom-elements-screen";
    this.af_componentTitle = "DOM Elements Component";
    this.span = document.createElement("span");
    const sv = new TestMessagesService();
    this.af_componentService = {
      fireServerEvent: sv.fireServerEvent
    };
  }

  public af_onMayClose() {
    return true; // this.span.textContent === "close me!";
  }

  public af_componentRoot() {
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

  public af_onMayClose() {
    return true;
  }

  public af_componentRoot() {
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

  public af_componentRoot() {
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
