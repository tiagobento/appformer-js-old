export interface AppFormerScreen {

    af_componentId: string;
    af_componentTitle: string;

    af_onOpen(): void

    af_onFocus(): void

    af_onLostFocus(): void

    af_onMayClose(): boolean

    af_componentRoot(): any

}

export abstract class DefaultAppFormerScreen implements AppFormerScreen {

    af_componentId: string;
    af_componentTitle: string;

    protected constructor(id: string,
                          title: string) {

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

    abstract af_componentRoot(): any;

}


export function goTo(path: string) {
    (<any>window).$goToPlace(path);
}