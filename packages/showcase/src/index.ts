import * as AppFormer from "appformer-js";
import * as ShowcaseComponents from "appformer-js-showcase-components";
import {
  ConsoleHeader,
  ShowcasePerspective,
  ConsolePerspective,
  NonReactShowcasePerspective
} from "appformer-js-dev-console";

//Registers the AppFormer components and the DevConsole components
AppFormer.register({
  ConsoleHeader,
  ShowcasePerspective,
  ...ShowcaseComponents,
  ConsolePerspective,
  NonReactShowcasePerspective
});
