import * as React from "react";
import * as AppFormer from "appformer-js";
import * as DevConsole from "appformer-js-dev-console";
import * as ShowcaseComponents from "./Screens";
import { ShowcasePerspective, NonReactShowcasePerspective } from "./Perspectives";

AppFormer.register(new ShowcaseComponents.StringElementScreen());
AppFormer.register(new ShowcaseComponents.PureDomElementScreen());
AppFormer.register(new ShowcaseComponents.ReactComponentScreen());
AppFormer.register(new ShowcasePerspective());
AppFormer.register(new NonReactShowcasePerspective());
AppFormer.register(new DevConsole.ConsoleHeader());
AppFormer.register(new DevConsole.ConsolePerspective());
AppFormer.goTo("showcase-perspective");

setTimeout(() => AppFormer.register(new ShowcaseComponents.SillyReactScreen()), 3000);
