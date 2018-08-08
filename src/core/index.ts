import * as React from "react";
import * as ReactDOM from "react-dom";
import {DefaultAppFormerScreen} from "core/API";

export * from './Clazz';
export * from './Components';
export * from './API';

export function register(components: any) {
    for (let c in components) {
        if (components.hasOwnProperty(c) && components[c].prototype instanceof DefaultAppFormerScreen) {
            let screen = new components[c]();
            console.info(`Registering screen ${screen.af_componentId}`);
            (<any>window).appformerBridge.registerScreen(screen);
        }
    }
}


export function render(component: React.ReactElement<any>,
                       container: HTMLElement) {

    ReactDOM.render(component, container);
}

//Expose this module as a global variable
(<any>window).appformer = this;

