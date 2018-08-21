import { RPC } from "app-former/index";
import { ErraiBusObject, TestEvent } from "generated/Model";
import * as Services from "generated/Services";

export const sayHello = () => RPC("org.uberfire.shared.TestMessagesService|hello", []);

export const fireServerEvent = () => RPC("org.uberfire.shared.TestMessagesService|helloFromEvent", []);

export const sayHelloOnServer = () => RPC("org.uberfire.shared.TestMessagesService|muteHello", []);

export const sayHelloToSomething = (a: string) =>
  RPC("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [Services.marshall(a)]);

export const sendTestPojo = (a: TestEvent & ErraiBusObject) =>
  RPC("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [Services.marshall(a)]);
