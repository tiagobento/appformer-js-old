import * as Internal from "core/Internal";
import {AppFormer} from "core/Components";

const bridge = (window as any).appformerGwtBridge || new Internal.Bridge(() => {
    console.info("Finished mounting AppFormer JS");
});

export const render = Internal.render;

export function goTo(path: string) {
    return bridge.goTo(path);
}

export function register(components: any) {
    for (let component in components) {
        if (components.hasOwnProperty(component)) {

            if (components[component].prototype instanceof AppFormer.Screen) {
                bridge.registerScreen(new components[component]());
            }

            else {
                //TODO: Register other kinds of components
            }
        }
    }
}