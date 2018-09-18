import * as AppFormer from "appformer-core";
import * as ShowcaseComponents from "showcase-components";
import { ConsoleHeader, ConsoleDefaultPerspective } from "dev-console";

//Registers the AppFormer components and the DevConsole components
AppFormer.register({ ...ShowcaseComponents,  ConsoleDefaultPerspective, ConsoleHeader });

