import * as React from "react";
import * as AppFormer from "appformer-js";
import * as ShowcaseComponents from "appformer-js-showcase-components";
import * as DevConsole from "appformer-js-dev-console";


AppFormer.goTo("showcase-perspective");
AppFormer.registerScreen(new ShowcaseComponents.StringElementScreen());
AppFormer.registerScreen(new ShowcaseComponents.PureDomElementScreen());
AppFormer.registerScreen(new ShowcaseComponents.ReactComponentScreen());
AppFormer.registerPerspective(new DevConsole.ShowcasePerspective());
AppFormer.registerPerspective(new DevConsole.NonReactShowcasePerspective());
AppFormer.registerPerspective(new DevConsole.ConsolePerspective());


setTimeout(() => AppFormer.registerScreen(new DevConsole.ConsoleHeader()), 2000);
setTimeout(() => AppFormer.registerScreen(new ShowcaseComponents.SillyReactScreen()), 4000);
