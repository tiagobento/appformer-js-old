import * as React from "react";
import { Console } from "./Console";
import { Element, Perspective, ScreenContainer } from "appformer-js";

export class ConsoleDefaultPerspective extends Perspective {
    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "default-perspective";
        this.af_perspectiveScreens = [
            "console-header",
            "A-react-screen",
            "dom-elements-screen",
            "string-template-screen",
            "silly-react-screen"
        ];
        this.af_isDefaultPerspective = true;
    }

    private spaced(component: any) {
        return <div style={{ minWidth: "300px", margin: "5px", minHeight: "100%" }}>{component}</div>;
    }

    public af_perspectiveRoot(): Element {
        return (
            <>
                <div className={"wrapper"}>
                    <header>
                        <ScreenContainer af_componentId={"console-header"} />
                    </header>

                    {this.spaced(<ScreenContainer af_componentId={"A-react-screen"} />)}
                    {this.spaced(<ScreenContainer af_componentId={"dom-elements-screen"} />)}
                    {this.spaced(<ScreenContainer af_componentId={"string-template-screen"} />)}
                    {this.spaced(<ScreenContainer af_componentId={"silly-react-screen"} />)}
                </div>
            </>
        );
    }
}

export class SecondPerspective extends Perspective {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "second-perspective";
    this.af_perspectiveScreens = ["console-header", "dom-elements-screen"];
    this.af_isDefaultPerspective = true;
  }

  public af_perspectiveRoot(): Element {
    return <Console />;
  }
}
