import * as React from "react";
import {AppFormer} from "core/Components";
import ScreenContainer from "core/internal/ScreenContainer";
import EventsConsolePanel from "core/internal/EventsConsolePanel";
import JsBridge from "core/internal/JsBridge";

type Props = { exposing: (self: () => Root) => void, bridge: JsBridge };

class State {
    currentPerspective?: AppFormer.Perspective;
    perspectives: AppFormer.Perspective[];
    screens: AppFormer.Screen[];
    openScreens: AppFormer.Screen[];
    hasAnOpen: (component: AppFormer.Component) => boolean;

    static hasAnOpen = (state: State) => (component: AppFormer.Component) => {
        return component instanceof AppFormer.Screen
            ? state.openScreens.indexOf(component) > -1
            : state.currentPerspective === component;
    }
}

const actions = {

    "registerPerspective": (perspective: AppFormer.Perspective) => (state: State): any => {
        //FIXME: First default perspective found is the one that wins.
        return {
            perspectives: [...state.perspectives, perspective],
            currentPerspective: state.currentPerspective
                ? state.currentPerspective
                : perspective.af_isDefaultPerspective ? perspective : undefined,
            openScreens: perspective.af_isDefaultPerspective
                ? state.screens.filter((screen) => perspective.has(screen))
                : state.openScreens
        }
    },

    "openPerspective": (perspective: AppFormer.Perspective) => (state: State): any => {

        let closeableScreens = state.openScreens
            .filter(screen => !perspective.has(screen)) //Filters out screens that will remain open
            .map(screen => ({
                screen: screen,
                canBeClosed: screen.af_onMayClose()
            }))
            .filter(t => !t.canBeClosed)
            .map(t => t.screen.af_componentId);

        if (closeableScreens.length > 0) {
            //FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
            const msg = `[${closeableScreens}] cannot be closed at the moment. Force closing and proceed to open ${perspective.af_componentId}?`;
            if (!confirm(msg)) {
                return state;
            }
        }

        return {
            currentPerspective: perspective,
            openScreens: state.screens.filter(screen => perspective.has(screen))
        };
    },

    "registerScreen": (screen: AppFormer.Screen) => (state: State): any => {
        return {
            screens: [...state.screens, screen]
        };
    },

    "closeScreen": (screen: AppFormer.Screen) => (state: State): any => {
        //FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
        const msg = `Screen ${screen.af_componentId} cannot be closed. Do you want to force it?`;
        if (screen.af_onMayClose() || confirm(msg)) {
            return {openScreens: state.openScreens.filter(s => s !== screen)};
        } else {
            return state;
        }
    },

    "openScreen": (screen: AppFormer.Screen) => (state: State): any => {
        if (!state.hasAnOpen(screen)) {
            return {openScreens: [...state.openScreens, screen]};
        }
    },

    "openScreenWithId": (screenId: string) => (state: State): any => {
        const screen = state.screens.filter(s => s.af_componentId === screenId).pop();
        return screen ? actions.openScreen(screen)(state) : state;
    }
};

export default class Root extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPerspective: undefined,
            perspectives: [],
            screens: [],
            openScreens: [],
            hasAnOpen: function (c) {
                return State.hasAnOpen(this)(c);
            }
        };
        this.props.exposing(() => this);
    }

    registerScreen(screen: AppFormer.Screen) {
        this.setState(actions.registerScreen(screen));
    }

    registerPerspective(perspective: AppFormer.Perspective) {
        this.setState(actions.registerPerspective(perspective));
    }

    openScreenWithId(screenId: string) {
        this.setState(actions.openScreenWithId(screenId));
    }

    public static componentContainerId(screen: AppFormer.Component) {
        return `component-container-${screen.af_componentId}`
    }

    componentWillUnmount() {
        this.state.screens.forEach(screen => {
            console.info(`Shutting down ${screen.af_componentId}`);
            screen.af_onShutdown();
        });
    }

    render() {

        return <div className={"af-js-root"}>

            {this.Header()}

            {this.state.openScreens.map(screen => (

                <ScreenContainer key={screen.af_componentId}
                                 bridge={this.props.bridge}
                                 containerId={Root.componentContainerId(screen)}
                                 screen={screen}
                                 onClose={() => this.setState(actions.closeScreen(screen))}/>

            ))}

            <EventsConsolePanel screens={this.state.openScreens}/>

        </div>;
    }

    private Header() {
        return <>
            <div className={"af-screens-panel"}>
                <div className={"contents"} style={{backgroundColor: "#2e2e2e"}}>
                    {this.state.perspectives.map(perspective => (

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

                        <button key={screen.af_componentId}
                                onClick={() => this.setState(actions.openScreen(screen))}
                                disabled={this.state.hasAnOpen(screen)}>

                            {screen.af_componentId}

                            {this.state.hasAnOpen(screen) && <Check/>}
                        </button>

                    ))}
                </div>
            </div>
        </>;
    }
}


const Check = () => <>
    <span style={{color: "green"}}>
        &nbsp;&#10003;
    </span>
</>;
