import {AppFormer} from "core/Components";
import Console from "core/console/Console";
import * as React from "react";



export class ConsoleDefaultPerspective extends AppFormer.Perspective {

    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "default-perspective";
        this.af_perspectiveScreens = ["console-dock", "console-header", "A-react-screen"];
        this.af_isDefaultPerspective = true;
    }


    af_perspectiveRoot(root: { ss: AppFormer.Screen[], ps: AppFormer.Perspective[] }): AppFormer.Element {
        return <Console screens={root.ss}/>;
    }

}