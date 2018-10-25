import * as React from "react";
import * as AppFormer from "appformer-js";
import * as DevConsole from "appformer-js-dev-console";
import * as ShowcaseComponents from "./Components";

AppFormer.goTo("showcase-perspective");
AppFormer.register(new ShowcaseComponents.StringElementScreen());
AppFormer.register(new ShowcaseComponents.PureDomElementScreen());
AppFormer.register(new ShowcaseComponents.ReactComponentScreen());
AppFormer.register(new DevConsole.ShowcasePerspective());
AppFormer.register(new DevConsole.NonReactShowcasePerspective());
AppFormer.register(new DevConsole.ConsolePerspective());
AppFormer.register(new DevConsole.ConsoleHeader());

setTimeout(() => AppFormer.register(new ShowcaseComponents.SillyReactScreen()), 3000);
