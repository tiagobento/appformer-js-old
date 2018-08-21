import { rpc } from "app-former/index";
import { ErraiBusObject, TestEvent } from "generated/Model";
import { marshall } from "generated/Services";

export const sayHello = () => rpc("org.uberfire.shared.TestMessagesService|hello", []);

export const fireServerEvent = () => rpc("org.uberfire.shared.TestMessagesService|helloFromEvent", []);

export const sayHelloOnServer = () => rpc("org.uberfire.shared.TestMessagesService|muteHello", []);

export const sayHelloToSomething = (a: string) =>
  rpc("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [marshall(a)]);

export const sendTestPojo = (a: TestEvent & ErraiBusObject) =>
  rpc("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [marshall(a)]);
