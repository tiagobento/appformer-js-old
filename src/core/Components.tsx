//
//
//
//
//FIXME: All public API methods need a revision. Their names are *temporary*.


import * as React from "react";

export namespace AppFormer {

    export const DefaultScreenContainerId = "default-container-for-screens";

    export type Subscriptions = { [channel: string]: (event: any) => void };

    export type Component = Screen | Perspective;

    export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;

    export abstract class Perspective {

        isReact: boolean = false;
        af_componentId: Readonly<string>;
        af_perspectiveScreens: Readonly<string[]>;
        af_isDefaultPerspective: Readonly<boolean>;

        abstract af_perspectiveRoot(): Element;

        public has(screen: AppFormer.Screen | string) {
            const id = typeof screen === 'string' ? screen : screen.af_componentId;
            return this.af_perspectiveScreens.indexOf(id) > -1;
        }
    }


    export abstract class Screen {

        isReact: boolean = false;
        af_componentId: Readonly<string>;
        af_componentTitle: Readonly<string>;
        af_subscriptions: () => Subscriptions; //FIXME: Maybe this one should be a method?

        af_onOpen(): void {
        }

        af_onFocus(): void {
        }

        af_onLostFocus(): void {
        }

        af_onMayClose(): boolean {
            return true;
        }

        af_onClose(): void {
        }

        af_onShutdown(): void {
        }

        abstract af_componentRoot(): Element;

        static containerId(screen: AppFormer.Screen) {
            return `container-for-screen-${screen.af_componentId}`;
        }
    }
}

export class DefaultPerspective extends AppFormer.Perspective {

    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "default-perspective";
        this.af_perspectiveScreens = [];
    }

    af_perspectiveRoot(): AppFormer.Element {
        return <>
            <div>
                <div style={{
                    textAlign: "center",
                    padding: "5px"
                }}>
                    This is the default perspective. It has no screens.
                </div>
                <div id={AppFormer.DefaultScreenContainerId}>

                </div>
            </div>
        </>;
    }

}