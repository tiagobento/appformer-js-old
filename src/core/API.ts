export interface AppFormerScreen {

    af_componentId: string;
    af_componentTitle: string;
    af_subscriptions: () => any;

    af_onOpen(): void

    af_onFocus(): void

    af_onLostFocus(): void

    af_onMayClose(): boolean

    af_onClose(): void

    af_onShutdown(): void

    af_componentRoot(): any

}

export abstract class DefaultAppFormerScreen implements AppFormerScreen {

    af_componentId: string;
    af_componentTitle: string;
    af_subscriptions: () => any;

    protected constructor(id: string, title: string) {

        this.af_componentId = id;
        this.af_componentTitle = title;
    }

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

    abstract af_componentRoot(): any;

}