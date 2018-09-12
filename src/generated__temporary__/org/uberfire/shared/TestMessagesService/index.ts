import { rpc } from "appformer";
import { marshall } from "appformer/marshalling";
import { TestEvent } from "generated__temporary__/Model";

export default class TestMessagesService {
  public sayHello() {
    return rpc("org.uberfire.shared.TestMessagesService|hello", []);
  }

  public fireServerEvent() {
    return rpc("org.uberfire.shared.TestMessagesService|helloFromEvent", []);
  }

  public sayHelloOnServer() {
    return rpc("org.uberfire.shared.TestMessagesService|muteHello", []);
  }

  public sayHelloToSomething(a: string) {
    return rpc("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [marshall(a)]);
  }

  public sendTestPojo(a: TestEvent) {
    return rpc("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [marshall(a)]);
  }
}
