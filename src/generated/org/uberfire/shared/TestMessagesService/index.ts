import * as AppFormer from "appformer";
import { marshall } from "appformer/remote";
import { TestEvent } from "../model/TestEvent";

export const sayHello = () => AppFormer.rpc("org.uberfire.shared.TestMessagesService|hello", []);

export const fireServerEvent = () => AppFormer.rpc("org.uberfire.shared.TestMessagesService|helloFromEvent", []);

export const sayHelloOnServer = () => AppFormer.rpc("org.uberfire.shared.TestMessagesService|muteHello", []);

export const sayHelloToSomething = (a: string) =>
  AppFormer.rpc("org.uberfire.shared.TestMessagesService|hello:java.lang.String", [marshall(a)]);

export const sendTestPojo = (a: TestEvent) =>
  AppFormer.rpc("org.uberfire.shared.TestMessagesService|postTestEvent:org.uberfire.shared.TestEvent", [marshall(a)]);
