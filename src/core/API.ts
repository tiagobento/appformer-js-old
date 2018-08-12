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

export function register(potentialComponents: any) {
    for (let potentialComponent in potentialComponents) {
        if (potentialComponents.hasOwnProperty(potentialComponent)) {

            const Component = potentialComponents[potentialComponent];

            if (Component.prototype instanceof AppFormer.Screen) {
                console.info(`Registering screen ${Component.prototype}`);
                bridge.registerScreen(new Component());
            }

            else if (Component.prototype instanceof AppFormer.Perspective) {
                console.info(`Registering perspective ${Component.prototype}`);
                bridge.registerPerspective(new Component());
            }

            else {
                //TODO: Register other kinds of components
            }
        }
    }
}