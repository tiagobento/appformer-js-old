import * as React from "react";
import {AppFormer} from "core/Components";
import EventsConsolePanel from "core/internal/EventsConsolePanel";
import JsBridge from "core/internal/JsBridge";
import PerspectiveContainer from "core/internal/PerspectiveContainer";
import {Link} from "core";



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
        return {screens: [...state.screens, screen]};
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

        //FIXME: Not checking onMayClose to close the existing screen
        const existingScreenId = container.getAttribute(PerspectiveContainer.AfOpenScreenAttr);
        if (existingScreenId) {
            return {openScreens: [...state.without(existingScreenId).openScreens, screen]};
        }

        if (!state.hasAnOpen(screen)) {
            return {openScreens: [...state.openScreens, screen]};
        }
    },
};


export default class Root extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPerspective: undefined,
            perspectives: [],
            screens: [],
            openScreens: [],
            hasAnOpen: function (c) { return State.hasAnOpen(this)(c); },
            without: function (c) { return State.without(this)(c); },
        };
        this.props.exposing(() => this);
    }


    registerScreen(screen: AppFormer.Screen) {
        this.setState(actions.registerScreen(screen));
    }


    registerPerspective(perspective: AppFormer.Perspective) {
        this.setState(actions.registerPerspective(perspective));
    }


    openScreen(screenId: string) {
        this.setState(actions.openScreen(screenId));
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

            {this.Header()}

            {this.state.currentPerspective &&

             <PerspectiveContainer
                 perspective={this.state.currentPerspective!}
                 screens={this.state.openScreens}
                 bridge={this.props.bridge}
                 onCloseScreen={screen => this.setState(actions.closeScreen(screen))}/>}

            <EventsConsolePanel screens={this.state.openScreens}/>

        </div>;
    }


    private Header() {
        return <div style={{
            position: "fixed", width: "100%", height: "100px",
        }}>
            <div className={"af-screens-panel"}>
                <div className={"contents"} style={{backgroundColor: "#2e2e2e"}}>
                    {this.state.perspectives.map(perspective => (

                        //FIXME: Implement goTo for perspectives
                        <button key={perspective.af_componentId}
                                onClick={() => this.setState(actions.openPerspective(perspective))}
                                disabled={this.state.hasAnOpen(perspective)}>

                            {perspective.af_componentId}

                            {this.state.hasAnOpen(perspective) && <Check/>}
                        </button>

                    ))}
                </div>

                <div className={"contents"}>
                    {this.state.screens.map(screen => (

                        <Link to={screen.af_componentId} key={screen.af_componentId}>
                            <button disabled={this.state.hasAnOpen(screen)}>
                                {screen.af_componentId} {this.state.hasAnOpen(screen) && <Check/>}
                            </button>
                        </Link>

                    ))}
                </div>
            </div>
        </div>;
    }
}


function Check() {
    return <span style={{color: "green"}}>
        &nbsp;&#10003;
    </span>;
}