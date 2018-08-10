import {DefaultAppFormerScreen} from "core/API";
import {AppFormerJsBridge} from "core";

export * from './Components';
export * from './API';

export const bridge = (window as any).appformerGwtBridge || new AppFormerJsBridge(() => {
    console.info("Finished mounting AppFormer JS");
});

export function register(components: any) {
    for (let component in components) {
        if (components.hasOwnProperty(component)) {

            if (components[component].prototype instanceof DefaultAppFormerScreen) {
                bridge.registerScreen(new components[component]());
            }

            else {
                //TODO: Register other kinds of components
            }
        }
    }
}


//Expose this module as a global variable
(window as any).appformer = this;




