import * as Core from "core";
import {AppFormer} from "core";
import * as AppFormerComponents from "core-screens/AppFormerComponents";

Core.register({
                  defaultPerspective: class DefaultPerspective extends AppFormer.Perspective {

                      constructor() {
                          super();
                          this.af_componentId = "default-perspective";
                          this.af_perspectiveScreens = [];
                      }

                      af_perspectiveRoot(): AppFormer.Element {
                          return "<div>This is the default perspective. It has no screens.</div>";
                      }

                  }, ...AppFormerComponents
              });

