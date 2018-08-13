//
//
//
//
//FIXME: All public API methods need a revision. Their names are *temporary*.


import {ReactElement} from "react";

export namespace AppFormer {

    export type Subscriptions = { [channel: string]: (event: any) => void };

    export type Component = Screen | Perspective;

    export type Element = ReactElement<any> | HTMLElement | string;

    export abstract class Perspective {

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

    }
}