//
//
//
//
//FIXME: All public API methods need a revision. Their names are *temporary*.


import * as React from "react";



export namespace AppFormer {

    export const DefaultScreenContainerId = "default-container-for-screens";

    export type Subscriptions = { [channel: string]: (event: any) => void };

    export type Service = { [name: string]: (a: any) => any };

    export type Component = Screen | Perspective;

    export type Element = React.ReactPortal | React.ReactElement<any> | HTMLElement | string;



    export abstract class Perspective {

        isReact: boolean = false;
        af_componentId: string;
        af_perspectiveScreens: string[];
        af_isDefaultPerspective: boolean;


        abstract af_perspectiveRoot(): Element;


        public has(screen: AppFormer.Screen | string) {
            const id = typeof screen === "string"
                ? screen
                : screen.af_componentId;
            return this.af_perspectiveScreens.indexOf(id) > -1;
        }
    }



    export abstract class Screen {

        isReact: boolean = false;
        af_componentId: string;
        af_componentTitle: string;
        af_componentService: Service;
        af_subscriptions: Subscriptions = {}; //FIXME: Maybe this one should be a method?

        af_onStartup(): void {}


        af_onOpen(): void {}


        af_onFocus(): void {}


        af_onLostFocus(): void {}


        af_onMayClose(): boolean {
            return true;
        }


        af_onClose(): void {}


        af_onShutdown(): void {}


        abstract af_componentRoot(): Element;


        static containerId(screen: AppFormer.Screen) {
            return `container-for-screen-${screen.af_componentId}`;
        }
    }
}