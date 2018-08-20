import * as React from "react";
import {AppFormer} from "core/Components";
import JsBridge from "core/internal/JsBridge";
import PerspectiveContainer from "core/internal/PerspectiveContainer";



interface Props {
    exposing: (self: () => Root) => void;
    bridge: JsBridge
}



class State {
    currentPerspective?: AppFormer.Perspective;
    perspectives: AppFormer.Perspective[];
    screens: AppFormer.Screen[];
    openScreens: AppFormer.Screen[];
    hasAnOpen: (component: AppFormer.Component) => boolean;
    without: (screenId: string) => State;

    static hasAnOpen = (state: State) => (component: AppFormer.Component) => {
        return component instanceof AppFormer.Screen
            ? state.openScreens.indexOf(component) > -1
            : state.currentPerspective === component;
    };

    static without = (state: State) => (screenId: string) => ({
        ...state, openScreens: state.openScreens.filter(s => s.af_componentId !== screenId),
    });
}



const actions = {

    "registerPerspective": (perspective: AppFormer.Perspective) => (state: State): any => ({
        perspectives: [...state.perspectives, perspective],
        currentPerspective: state.currentPerspective
            ? state.currentPerspective
            : perspective.af_isDefaultPerspective
                ? perspective //Last default perspective found is the one that wins.
                : undefined,
        openScreens: perspective.af_isDefaultPerspective
            ? state.screens.filter((screen) => perspective.has(screen))
            : state.openScreens,
    }),


    "registerScreen": (screen: AppFormer.Screen) => (state: State): any => {
        return {
            screens: [...state.screens, screen],
            openScreens: (state.currentPerspective && state.currentPerspective!.has(screen))
                ? [...state.openScreens, screen]
                : state.openScreens,
        };
    },


    "open": (place: string) => (state: State): any => {
        const perspective = state.perspectives.filter(s => s.af_componentId === place).pop();
        if (perspective) {
            return actions.openPerspective(perspective!)(state);
        }

        return actions.openScreen(place)(state);
    },


    "openPerspective": (perspective: AppFormer.Perspective) => (state: State): any => {

        let uncloseableScreens = state.openScreens
            .filter(screen => !perspective.has(screen)) //Filters out screens that will remain open
            .map(screen => ({screen: screen, canBeClosed: screen.af_onMayClose()}))
            .filter(t => !t.canBeClosed)
            .map(t => t.screen.af_componentId);

        //FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
        const msg = `[${uncloseableScreens}] cannot be closed at the moment. Force closing and proceed to ${perspective.af_componentId}?`;
        if (uncloseableScreens.length > 0 && !confirm(msg)) {
            return state;
        }

        return {
            currentPerspective: perspective,
            openScreens: state.screens.filter(screen => perspective.has(screen)),
        };
    },

    "closeScreen": (screen: AppFormer.Screen) => (state: State): any => {
        //FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
        const msg = `${screen.af_componentId} cannot be closed. Do you want to force it?`;
        if (!screen.af_onMayClose() && !confirm(msg)) {
            return state;
        }

        return {openScreens: state.openScreens.filter(s => s !== screen)};
    },


    "openScreen": (screenId: string) => (state: State): any => {

        const screen = state.screens.filter(x => x.af_componentId === screenId).pop();
        if (!screen) {
            console.error(`No screen found with id ${screenId}.`);
            return state;
        }

        const container = PerspectiveContainer.findContainerFor(screen, state.currentPerspective!);
        if (!container) {
            console.error(`Could not render ${screen.af_componentId}. No default container for screens found on perspective [${state.currentPerspective!.af_componentId}]. Add a div with id \"default-container-for-screens\" to your perspective and try again.`);
            return state;
        }

        const existingScreenId = container.getAttribute(PerspectiveContainer.AfOpenScreenAttr);
        if (existingScreenId) {
            //FIXME: Not checking onMayClose to close the existing screen
            return {openScreens: [...state.without(existingScreenId).openScreens, screen]};
        }

        if (state.hasAnOpen(screen)) {
            console.info(`Screen ${screen.af_componentId} is already open.`);
            return;
        }

        return {openScreens: [...state.openScreens, screen]};
    },
};


export default class Root extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.props.exposing(() => this);
        this.state = {
            currentPerspective: undefined,
            perspectives: [],
            screens: [],
            openScreens: [],
            hasAnOpen(c) { return State.hasAnOpen(this)(c); },
            without(c) { return State.without(this)(c); },
        };
    }


    registerScreen(screen: AppFormer.Screen) {
        this.setState(actions.registerScreen(screen));
    }


    registerPerspective(perspective: AppFormer.Perspective) {
        this.setState(actions.registerPerspective(perspective));
    }


    open(place: string) {
        this.setState(actions.open(place));
    }


    componentDidUpdate(pp: Readonly<Props>, ps: Readonly<State>, snapshot?: any): void {
        console.info("=======================");
    }


    componentWillUnmount() {
        this.state.screens.forEach(screen => {
            console.info(`...Shutting down ${screen.af_componentId}...`);
            screen.af_onShutdown();
            console.info(`Shut down ${screen.af_componentId}.`);
        });
    }


    render() {
        return <div className={"af-js-root"}>

            {this.state.currentPerspective && <PerspectiveContainer
                root={{ss: this.state.screens, ps: this.state.perspectives}}
                perspective={this.state.currentPerspective!}
                screens={this.state.openScreens}
                bridge={this.props.bridge}
                onCloseScreen={screen => this.setState(actions.closeScreen(screen))}
            />}

        </div>;
    }
}
