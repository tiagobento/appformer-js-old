import * as AppFormer from "appformer-core";
import * as ShowcaseComponents from "showcase-components";
import { ConsoleHeader, ConsoleDefaultPerspective } from "appformer-core";

//Registers the AppFormer components
AppFormer.register({ ...ShowcaseComponents,  ConsoleDefaultPerspective, ConsoleHeader });

