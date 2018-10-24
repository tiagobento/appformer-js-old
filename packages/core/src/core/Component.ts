import * as React from "react";

export abstract class Component {
    public af_componentId: string;
    public isReact: boolean = false;
    public hasContext: boolean = false;
    public type: string;

    public abstract af_componentRoot(children?: any): Element;
}

export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;
