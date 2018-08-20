import { RPC } from "core";
import { TestEvent, ErraiBusObject, Portable } from "generated/Model";

function marshall(obj: Portable<any> & ErraiBusObject | string) {
  return typeof obj != "string" ? obj.__toErraiBusObject().__toJson() : obj;
}

// TODO: Implement to return an object from the Model file
function unmarshall(json: any) {
  return json;
}

export namespace Services {
  export namespace org {
    export namespace uberfire {
      export namespace shared {
        export const TestMessagesService = {
          sayHello: () => RPC("org.uberfire.shared.TestMessagesService|hello", []),

          fireServerEvent: () => RPC("org.uberfire.shared.TestMessagesService|helloFromEvent", []),

          sayHelloOnServer: () => RPC("org.uberfire.shared.TestMessagesService|muteHello", []),

          sayHelloToSomething: (a: string) =>
            RPC("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [marshall(a)]),

          sendTestPojo: (a: TestEvent & ErraiBusObject) =>
            RPC("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [marshall(a)])
        };
      }
    }
  }
}
