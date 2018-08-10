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

    get(path: string, params: any[]) {
        console.info("Requested " + path);
    }

    goTo(path: string) {
        alert(`Go to ${path} called!`);
    }
}

namespace Root {
    export type Props = { exposing: (self: () => Component) => void };
    export type State = { screens: AppFormer.Screen[], openScreens: AppFormer.Screen[] };

    export class Component extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {screens: [], openScreens: []};
            this.props.exposing(() => this);
        }

        registerScreen(screen: AppFormer.Screen) {
            this.setState(prevState => ({
                screens: [...prevState.screens, screen],
                openScreens: [...prevState.openScreens, screen]
            }));
        }

        openScreen(screen: AppFormer.Screen) {
            if (!this.isOpen(screen)) {
                this.setState(prevState => ({
                    openScreens: [...prevState.openScreens, screen]
                }));
            }
        }

        closeScreen(screen: AppFormer.Screen) {
            if (screen.af_onMayClose()) {
                this.setState(prevState => ({
                    openScreens: prevState.openScreens.filter(s => s !== screen)
                }));
            }
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

        private isOpen(screen: AppFormer.Screen) {
            return this.state.openScreens.indexOf(screen) >= 0;
        }


        componentDidUpdate(prevProps: Readonly<Props>,
                           prevState: Readonly<State>,
                           snapshot?: any): void {

            const diff = (a: AppFormer.Screen[],
                          b: AppFormer.Screen[]) => a.filter((i) => b.indexOf(i) < 0);

            diff(prevState.openScreens, this.state.openScreens).forEach(removedScreen => {
                console.info(`Closing ${removedScreen.af_componentId}`);
                removedScreen.af_onClose();
            });

            diff(this.state.openScreens, prevState.openScreens).forEach(newScreen => {

                console.info(`Opening ${newScreen.af_componentId}`);

                render(newScreen.af_componentRoot(),
                       document.getElementById(this.containerId(newScreen)),
                       () => {
                           console.info(`Rendered ${newScreen.af_componentId}`);
                           newScreen.af_onOpen();
                       });
            });
        }

        componentWillUnmount(): void {
            this.state.screens.forEach(screen => {
                console.info(`Shutting down ${screen.af_componentId}`);
                screen.af_onShutdown();
            });
        }

        containerId(screen: AppFormer.Screen) {
            return `screen-container-${screen.af_componentId}`
        }

        render() {
            return <div className={"af-js-root"}>

                <EventsConsolePanel.Component
                    subscriptions={this.subscriptionsOfAllOpenScreens()}/>

                <div className={"af-screens-panel"}>
                    <div className={"contents"}>
                        {this.state.screens.map(screen => (

                            <button key={screen.af_componentId}
                                    onClick={() => this.openScreen(screen)}
                                    disabled={this.isOpen(screen)}>
                                {screen.af_componentId}
                            </button>

                        ))}
                    </div>
                </div>


                {this.state.openScreens.map(screen => (

                    <ScreenContainer.Component key={screen.af_componentId}
                                               containerId={this.containerId(screen)}
                                               screen={screen}
                                               onClose={() => this.closeScreen(screen)}/>

                ))}

                <CoolBackground/>
            </div>;
        }
    }
}

namespace ScreenContainer {

    export interface Props {
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
                <span>
                    <span>{screen.af_componentTitle}</span>
                    &nbsp;&nbsp;
                    <a style={{color: "#828282"}} href="#"
                       onClick={() => this.props.onClose()}>Close</a>
                </span>
                </div>

                <div className={"contents"} id={this.props.containerId}>
                    {/*Empty on purpose*/}
                    {/*This is where the screens will be rendered on.*/}
                    {/*Each screens gets a fresh container*/}
                </div>
            </div>;
        }
    }
}


namespace EventsConsolePanel {
    //FIXME: fix subscriptions type (Map<String, Consumer<Object>)
    export type Props = { subscriptions: any }
    export type State = { event: string, channel?: string }

    export class Component extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {event: ""};
        }

        componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
            this.setState({channel: Object.keys(nextProps.subscriptions).sort()[0] || null});
        }

        private sendEvent() {
            this.props.subscriptions[this.state.channel](this.state.event);
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

function CoolBackground() {
    return <>
        <h1 style={{
            position: "absolute",
            top: "-150px",
            left: "-120px",
            margin: 0,
            zIndex: -20,
            fontSize: "60em",
            maxHeight: "0",
            textAlign: "left",
            fontWeight: "lighter",
            opacity: 0.02,
            color: "black"
        }}>App</h1>

        <h1 style={{
            position: "absolute",
            top: "384px",
            left: "170px",
            marginTop: "100px",
            zIndex: -20,
            fontSize: "30em",
            maxHeight: "0",
            textAlign: "left",
            fontWeight: "lighter",
            opacity: 0.04,
            color: "black"
        }}>Former.js</h1>

        <hr style={{position: "absolute", top: "922px", width: "100%"}}/>

        <span style={{
            top: "895px", position: "absolute", right: 0, padding: "10px"
        }}>AppFormer.js</span>
    </>
}