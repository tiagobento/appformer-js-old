import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppFormer} from "core/Components";

export function render(component: any, container: HTMLElement, callback = () => {
}) {

    if (component instanceof HTMLElement) {
        container.innerHTML = "";
        container.appendChild(component);
        callback();
    }

    else if (typeof component.prototype === "string" || component.prototype instanceof String) {
        container.innerHTML = component as string;
        callback();
    }

    else {
        ReactDOM.render(component, container, callback);
    }
}

export class Bridge {

    root: () => Root.Component;

    constructor(callback: () => void) {
        const root = <Root.Component exposing={root => this.root = root}/>;
        render(root, document.body.children[0] as HTMLElement, callback);
    }

    registerScreen(screen: AppFormer.Screen) {
        this.root().registerScreen(screen);
    }

    registerPerspective(perspective: AppFormer.Perspective) {
        this.root().registerPerspective(perspective);
    }

    goTo(path: string) {
        this.root().openScreenWithId(path);
    }

    get(path: string, params: any[]) {
        return Promise.reject("Sorry, RPC mocks are not available yet :(");
    }
}

export namespace Root {
    type Props = { exposing: (self: () => Component) => void };

    interface State {
        currentPerspective?: AppFormer.Perspective;
        perspectives: AppFormer.Perspective[];
        screens: AppFormer.Screen[];
        openScreens: AppFormer.Screen[];
        canBeClosed: (thing: AppFormer.Screen | AppFormer.Perspective) => boolean;
    }

    export class Component extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {
                currentPerspective: undefined,
                perspectives: [],
                screens: [],
                openScreens: [],

                //FIXME: Is there a way to put this function inside State type declaration?
                canBeClosed: function (thing: AppFormer.Screen | AppFormer.Perspective) {
                    if (thing instanceof AppFormer.Screen) {
                        return this.openScreens.indexOf(thing) > -1;
                    } else {
                        return this.currentPerspective === thing;
                    }
                }
            };
            this.props.exposing(() => this);
        }

        static actions = {

            "registerPerspective": (perspective: AppFormer.Perspective) => (state: State): any => {
                //FIXME: First default perspective found is the one that wins.
                return {
                    perspectives: [...state.perspectives, perspective],
                    currentPerspective: state.currentPerspective
                        ? state.currentPerspective
                        : perspective.default ? perspective : undefined,
                    openScreens: perspective.default
                        ? state.screens.filter((screen) => perspective.has(screen))
                        : state.openScreens
                }
            },

            "openPerspective": (perspective: AppFormer.Perspective) => (state: State): any => {

                let closeableScreens = state.openScreens
                    .map(screen => ({
                        screen: screen,
                        canBeClosed: screen.af_onMayClose()
                    }))
                    .filter(t => !t.canBeClosed)
                    .map(t => t.screen.af_componentId);

                if (closeableScreens.length > 0) {
                    const msg = `[${closeableScreens}] cannot be closed at the moment. Force close and proceed to open ${perspective.id}?`;
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
                const msg = `Screen ${screen.af_componentId} cannot be closed. Do you want to force it?`;
                if (screen.af_onMayClose() || confirm(msg)) {
                    return {openScreens: state.openScreens.filter(s => s !== screen)};
                } else {
                    return state;
                }
            },

            "openScreen": (screen: AppFormer.Screen) => (state: State): any => {
                if (!state.canBeClosed(screen)) {
                    return {openScreens: [...state.openScreens, screen]};
                }
            },

            "openScreenWithId": (screenId: string) => (state: State): any => {
                const screen = state.screens.filter(s => s.af_componentId === screenId).pop();
                return screen ? Component.actions.openScreen(screen)(state) : state;
            }
        };

        registerScreen(screen: AppFormer.Screen) {
            this.setState(Component.actions.registerScreen(screen));
        }

        registerPerspective(perspective: AppFormer.Perspective) {
            this.setState(Component.actions.registerPerspective(perspective));
        }

        openPerspective(perspective: AppFormer.Perspective) {
            this.setState(Component.actions.openPerspective(perspective));
        }

        openScreenWithId(screenId: string) {
            this.setState(Component.actions.openScreenWithId(screenId));
        }

        openScreen(screen: AppFormer.Screen) {
            this.setState(Component.actions.openScreen(screen));
        }

        closeScreen(screen: AppFormer.Screen) {
            this.setState(Component.actions.closeScreen(screen));
        }

        private static containerId(screen: AppFormer.Screen) {
            return `screen-container-${screen.af_componentId}`
        }

//FIXME: There's probably a much better way to do that without increasing the stack size too much.
        subscriptionsOfAllOpenScreens() {

            let all: any = {};

            const subscriptions = this.state.openScreens
                .filter(s => s.af_subscriptions)
                .map(s => s.af_subscriptions() as any);

            subscriptions.forEach(subscription => {
                for (const channel in subscription) {
                    if (subscription.hasOwnProperty(channel)) {
                        if (!all[channel]) {
                            all[channel] = subscription[channel];
                        } else {
                            const prev = all[channel];
                            all[channel] = (a: any) => {
                                prev(a);
                                (subscription[channel] as any)(a);
                            };
                        }
                    }
                }
            });

            return all;
        }

        componentDidUpdate(prevProps: Readonly<Props>,
                           prevState: Readonly<State>,
                           snapshot ?: any): void {

            const diff = (a: AppFormer.Screen[],
                          b: AppFormer.Screen[]) => a.filter((i) => b.indexOf(i) < 0);

            diff(prevState.openScreens, this.state.openScreens).forEach(removedScreen => {
                console.info(`Closing ${removedScreen.af_componentId}`);
                removedScreen.af_onClose();
            });

            diff(this.state.openScreens, prevState.openScreens).forEach(newScreen => {

                console.info(`Opening ${newScreen.af_componentId}`);

                render(newScreen.af_componentRoot(),
                       document.getElementById(Component.containerId(newScreen))!,
                       () => {
                           console.info(`Rendered ${newScreen.af_componentId}`);
                           newScreen.af_onOpen();
                       });
            });
        }

        componentWillUnmount() {
            this.state.screens.forEach(screen => {
                console.info(`Shutting down ${screen.af_componentId}`);
                screen.af_onShutdown();
            });
        }

        render() {

            return <div className={"af-js-root"}>

                {/*<CoolBackground/>*/}

                <EventsConsolePanel.Component
                    subscriptions={this.subscriptionsOfAllOpenScreens()}/>

                {this.ScreensPicker()}

                {this.state.openScreens.map(screen => (

                    <ScreenContainer.Component key={screen.af_componentId}
                                               containerId={Component.containerId(screen)}
                                               screen={screen}
                                               onClose={() => this.closeScreen(screen)}/>

                ))}

            </div>;
        }

        private ScreensPicker() {
            return <>
                <div className={"af-screens-panel"}>
                    <div className={"contents"} style={{backgroundColor: "#2e2e2e"}}>
                        {this.state.perspectives.map(perspective => (

                            <button key={perspective.id}
                                    onClick={() => this.openPerspective(perspective)}
                                    disabled={this.state.canBeClosed(perspective)}>

                                {perspective.id}

                                {this.state.canBeClosed(perspective) && <Check/>}
                            </button>

                        ))}
                    </div>

                    <div className={"contents"}>
                        {this.state.screens.map(screen => (

                            <button key={screen.af_componentId}
                                    onClick={() => this.openScreen(screen)}
                                    disabled={this.state.canBeClosed(screen)}>

                                {screen.af_componentId}

                                {this.state.canBeClosed(screen) && <Check/>}
                            </button>

                        ))}
                    </div>
                </div>
            </>;
        }
    }
}

namespace ScreenContainer {

    interface Props {
        containerId: string;
        screen: AppFormer.Screen;
        onClose: () => void;
    }

    export class Component extends React.Component<Props, {}> {

        constructor(props: Props) {
            super(props);
        }

        render() {
            const screen = this.props.screen;
            return <div className={"af-screen-container"}
                        key={screen.af_componentId}
                        onFocus={() => screen.af_onFocus()}
                        onBlur={() => screen.af_onLostFocus()}>

                <div className={"title"}>
                    {this.titleBar(screen)}
                </div>

                <div className={"contents"} id={this.props.containerId}>
                    {/*Empty on purpose*/}
                    {/*This is where the screens will be rendered on.*/}
                    {/*Each screens gets a fresh container*/}
                </div>
            </div>;
        }

        private titleBar(screen: AppFormer.Screen) {
            return <>
                <span>
                    <span>{screen.af_componentTitle}</span>
                    &nbsp;&nbsp;
                    <a href="#"
                       style={{color: "#828282"}}
                       onClick={() => this.props.onClose()}>Close</a>
                </span>
            </>;
        }
    }
}

function Check() {
    return <>
        <span style={{color: "green"}}>
           &nbsp;&#10003;
        </span>
    </>;
}

namespace EventsConsolePanel {

    type Props = { subscriptions: AppFormer.Subscriptions }
    type State = { event: string, channel?: string }

    export class Component extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {event: ""};
        }

        componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
            this.setState({channel: Object.keys(nextProps.subscriptions).sort()[0] || undefined});
        }

        private sendEvent() {
            if (this.state.channel) {
                this.props.subscriptions[this.state.channel!](this.state.event)
            }
        }

        render() {
            return (

                <div className={"af-events-console"}>

                    <div className={"title"}>
                        <span>Events simulation console</span>
                    </div>

                    <div className={"contents"}>
                        {this.state.channel && <>

                            <select value={this.state.channel}
                                    onChange={e => this.setState({channel: e.target.value})}>

                                {Object.keys(this.props.subscriptions).sort().map(channel => {
                                    return <option key={channel} value={channel}>{channel}</option>
                                })}

                            </select>

                            &nbsp;

                            <input onChange={e => this.setState({event: e.target.value})}
                                   placeholder={"Type event value"} value={this.state.event}/>

                            &nbsp;

                            <button onClick={() => this.sendEvent()}>
                                Send event!
                            </button>
                        </>}

                        {!this.state.channel && <>
                            <p>No one is listening to events at the moment :(</p>
                        </>}
                    </div>
                </div>

            );
        }
    }
}