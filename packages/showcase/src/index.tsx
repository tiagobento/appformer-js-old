import * as React from "react";
import * as AppFormer from "appformer-js";
import * as DevConsole from "appformer-js-dev-console";
import * as ShowcaseComponents from "./Components";

AppFormer.goTo("showcase-perspective");
AppFormer.registerScreen(new ShowcaseComponents.StringElementScreen());
AppFormer.registerScreen(new ShowcaseComponents.PureDomElementScreen());
AppFormer.registerScreen(new ShowcaseComponents.ReactComponentScreen());
AppFormer.registerPerspective(new DevConsole.ShowcasePerspective());
AppFormer.registerPerspective(new DevConsole.NonReactShowcasePerspective());
AppFormer.registerPerspective(new DevConsole.ConsolePerspective());
AppFormer.registerScreen(new DevConsole.ConsoleHeader());

setTimeout(() => AppFormer.registerScreen(new ShowcaseComponents.SillyReactScreen()), 3000);
