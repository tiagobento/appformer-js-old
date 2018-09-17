import * as AppFormer from "appformer-core";
import { ConsoleHeader, ConsoleDefaultPerspective } from "appformer-core";

//Registers the AppFormer components
AppFormer.register({ ConsoleDefaultPerspective });

import * as ShowcaseComponents from "showcase_components";
console.info(ShowcaseComponents);

AppFormer.register({ ConsoleHeader });
