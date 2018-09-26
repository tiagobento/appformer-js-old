import * as React from "react";
import { DemoReactComponent } from "./DemoReactComponent";
import { JavaInteger, Screen } from "appformer-js";
import { TestMessagesService } from "@kiegroup-ts-generated/uberfire-webapp-rpc";
import { Foo, TestEvent } from "@kiegroup-ts-generated/uberfire-webapp";
import { VFSService } from "@kiegroup-ts-generated/uberfire-backend-api-rpc";
import { PreferenceStore } from "@kiegroup-ts-generated/uberfire-preferences-api-rpc";
import { WorkbenchServices } from "@kiegroup-ts-generated/uberfire-backend-api-rpc";
import { PerspectiveDefinition } from "@kiegroup-ts-generated/uberfire-api";

// import homePerspectiveTemplate from "showcase-components/HomePerspective.html";
// import otherPerspectiveTemplate from "showcase-components/other-perspective.html";

export class InoffensiveNonScreenClass {}

export class ReactComponentScreen extends Screen {
  public onFoo: (e: any) => void;

  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "A-react-screen";
    this.af_componentTitle = "React Component";

    const javaInteger = new JavaInteger("0");

    this.af_subscriptions = {
      "org.uberfire.shared.TestEvent": (testEvent: TestEvent) => {
        return this.onFoo(`An event from server has arrived! "${testEvent.bar}"`);
      }
    };

    const testMessagesService = new TestMessagesService();
    const vfsService = new VFSService();

    const preferenceStore = new WorkbenchServices();
    preferenceStore.loadPerspectives({}).then(s => {
      console.log(s);
    });

    // vfsService.get({ arg0: "/pom.xml" }).then(s => {
    //   s.getFileName();
    // });
    //
    this.af_componentService = {
      sayHello: testMessagesService.hello0,
      sayHelloToSomething: testMessagesService.hello1,
      sayHelloOnServer: testMessagesService.muteHello,
      fireServerEvent: testMessagesService.helloFromEvent,
      sendTestPojo: testMessagesService.postTestEvent
    };
  }

  public af_onStartup() {
    console.info(`Startup ${this.af_componentId}`);
  }

  public af_onOpen() {
    const testEventInstance = new TestEvent({
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
        return this.af_componentService.sayHelloToSomething({ who: "foo" });
      })
      .then(msg => {
        console.info(`Second call returned (${msg})`);
        return this.af_componentService.sayHelloOnServer();
      })
      .then(msg => {
        console.info(`Third call returned (${msg})`);
        return this.af_componentService.sendTestPojo({ testEvent: testEventInstance });
      })
      .then(msg => {
        console.info(`Fourth call returned:`);
        console.info(msg);
        console.info(`All calls returned successfully!!!`);
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
    return (
      <div>
        <br />
        <button className={"btn btn-primary btn-sm"} onClick={() => this.af_componentService.fireServerEvent()}>
          Click me to make server send an event...
        </button>
        <br />

        <DemoReactComponent number={this.af_componentId} onFoo={(x: any) => (this.onFoo = x)} />
      </div>
    );
  }
}

export class PureDomElementScreen extends Screen {
  public span: HTMLElement;

  constructor() {
    super();
    this.af_componentId = "dom-elements-screen";
    this.af_componentTitle = "DOM Elements Component";
    this.span = document.createElement("span");
    const testMessagesService = new TestMessagesService();
    this.af_componentService = {
      fireServerEvent: testMessagesService.helloFromEvent
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

export class StringElementScreen extends Screen {
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

export class SillyReactScreen extends Screen {
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
