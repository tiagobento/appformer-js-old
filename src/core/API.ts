import * as Internal from "core/Internal";
import {AppFormer} from "core/Components";

const bridge = (window as any).appformerGwtBridge || new Internal.Bridge(() => {
    console.info("Finished mounting AppFormer JS");
});

export const render = Internal.render;

export const get = bridge.get;

export function goTo(path: string) {
    return bridge.goTo(path);
}

export function register(components: any) {
    for (let component in components) {
        if (components.hasOwnProperty(component)) {

            const c = components[component];
            if (c.prototype instanceof AppFormer.Screen) {
                bridge.registerScreen(new c());
            }

            else {
                //TODO: Register other kinds of components
            }
        }
    }
}