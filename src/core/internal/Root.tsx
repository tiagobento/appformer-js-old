import * as React from "react";
import {AppFormer} from "core/Components";
import EventsConsolePanel from "core/internal/EventsConsolePanel";
import JsBridge from "core/internal/JsBridge";
import PerspectiveContainer from "core/internal/PerspectiveContainer";
import {Link, Floating} from "core/react/Shorthands";



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
        return <div className={"af-js-root"}
                    style={{width: "100%", height: "100%", position: "absolute"}}>

            {this.Header()}

            {this.state.currentPerspective &&

             <PerspectiveContainer
                 perspective={this.state.currentPerspective!}
                 screens={this.state.openScreens}
                 bridge={this.props.bridge}
                 onCloseScreen={screen => this.setState(actions.closeScreen(screen))}/>}

            <Floating>
                <EventsConsolePanel screens={this.state.screens}/>
            </Floating>

            <Floating>
                <div className={"af-events-console"} hidden>

                    <div className={"title"}>
                        <span>RPC simulation console</span>
                    </div>

                    <div className={"contents"}>
                        <select style={{width: "100%"}}>
                            {this.getMethods().map((method: string) => {
                                return <option key={method} value={method}>{method}</option>;
                            })}
                        </select>

                        <br/>
                        <br/>
                        <span>Mocked reurn:</span>
                        <br/>
                        <textarea placeholder={"Type JSON here..."} />
                    </div>
                </div>
            </Floating>

        </div>;
    }


    private getMethods() {
        const concat = (x: any, y: any) => x.concat(y);

        const methods = (this.state.screens as any).map((screen: any) => {

            const service = screen.af_componentService;

            const AF = (window as any).appformer;
            const originalRPC = AF.RPC;

            // monkey patch 🙊🙉🙈
            AF.RPC = function (methodSignature: any, _: any[]) {
                return methodSignature;
            };

            const methods = Object.keys(service).map(x => (service[x] as any)());
            AF.RPC = originalRPC;
            return methods;
        }).reduce(concat, []);

        return methods.filter((a: any, b: number) => methods.indexOf(a) === b);
    }


    private Header() {
        return <div style={{
            position: "fixed", width: "100%", height: "100px",
        }}>
            <div className={"af-screens-panel"}>
                <div className={"contents"} style={{backgroundColor: "#2e2e2e"}}>
                    {this.state.perspectives.map(p => (

                        <Link to={p.af_componentId} key={p.af_componentId}>
                            <button disabled={this.state.hasAnOpen(p)}>
                                {p.af_componentId} {this.state.hasAnOpen(p) && <Check/>}
                            </button>
                        </Link>

                    ))}
                </div>

                <div className={"contents"}>
                    {this.state.screens.map(s => (

                        <Link to={s.af_componentId} key={s.af_componentId}>
                            <button disabled={this.state.hasAnOpen(s)}>
                                {s.af_componentId} {this.state.hasAnOpen(s) && <Check/>}
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