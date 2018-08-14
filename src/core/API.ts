import {AppFormer} from "core/Components";
import JsBridge from "core/internal/JsBridge";

const jsBridge = new JsBridge();

const bridge = (window as any).appformerGwtBridge || jsBridge.init(() => {
    console.info("Finished mounting AppFormer JS");
});

export const render = jsBridge.render;

export const RPC = bridge.RPC;

export function goTo(path: string) {
    return bridge.goTo(path);
}

export function register(potentialComponents: any) {
    for (let potentialComponent in potentialComponents) {
        if (potentialComponents.hasOwnProperty(potentialComponent)) {

            const Component = potentialComponents[potentialComponent];

            if (Component.prototype instanceof AppFormer.Screen) {
                console.info(`Registering screen [${Component.prototype.constructor.name}]`);
                bridge.registerScreen(new Component());
            }

            else if (Component.prototype instanceof AppFormer.Perspective) {
                console.info(`Registering perspective [${Component.prototype.constructor.name}]`);
                bridge.registerPerspective(new Component());
            }

            else {
                //TODO: Register other kinds of components
            }
        }
    }
}