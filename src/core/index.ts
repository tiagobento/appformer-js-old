import {DefaultAppFormerScreen} from "core/API";
import {AppFormerJsMockBridge} from "core";

export * from './Components';
export * from './API';

export const bridge = (window as any).appformerGwtBridge || new AppFormerJsMockBridge(() => {
    console.info("Finished mounting AppFormer JS");
});

export function register(components: any) {
    for (let c in components) {
        if (components.hasOwnProperty(c) && components[c].prototype instanceof DefaultAppFormerScreen) {
            let screen = new components[c]();
            console.info(`Registering screen ${screen.af_componentId}`);
            bridge.registerScreen(screen);
        }
    }
}


//Expose this module as a global variable
(window as any).appformer = this;




