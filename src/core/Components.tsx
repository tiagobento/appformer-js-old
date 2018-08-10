import * as React from "react";
import * as Core from "core";
import * as ReactDOM from "react-dom";
import {DefaultAppFormerScreen} from "core/API";

export class AppFormerJsBridge {

    root: () => AppFormerJsRoot;

    constructor(callback: () => void) {
        let root = <AppFormerJsRoot exposing={self => this.root = self}/>;
        Core.render(root, document.getElementById("appformer-root"), callback);
    }

    registerScreen(screen: DefaultAppFormerScreen) {
        this.root().registerScreen(screen);
    }

    goTo(path: string) {
        console.log(typeof (this.root() as any));
        alert(`Go to ${path} called!`);
    }
}

type AppFormerJsRootProps = { exposing: (self: () => AppFormerJsRoot) => void };
type AppFormerJsRootState = { screens: DefaultAppFormerScreen[] };

class AppFormerJsRoot extends React.Component<AppFormerJsRootProps, AppFormerJsRootState> {

    constructor(props: AppFormerJsRootProps) {
        super(props);
        this.state = {screens: []};
        this.props.exposing(() => this);
    }

    registerScreen(screen: DefaultAppFormerScreen) {
        this.setState(prevState => ({
            screens: [...prevState.screens, screen]
        }));
    }

    removeScreen(screen: DefaultAppFormerScreen) {
        if (screen.af_onMayClose()) {
            this.setState(prevState => ({
                screens: prevState.screens.filter(s => s !== screen)
            }));
        }
    }

    subscriptionsOfAllOpenScreens() {
        return this.state.screens
            .filter(s => s.af_subscriptions)
            .map(s => s.af_subscriptions())
            .reduce((a, b) => ({...a, ...b}), {});
    }

    diff<T>(a: T[], b: T[]): T[] {
        return a.filter((i) => b.indexOf(i) < 0);
    }

    componentDidUpdate(prevProps: Readonly<AppFormerJsRootProps>,
                       prevState: Readonly<AppFormerJsRootState>,
                       snapshot?: any): void {

        this.diff(prevState.screens, this.state.screens).forEach(removedScreen => {
            console.info(`Removing ${removedScreen.af_componentId}`);
            removedScreen.af_onClose();
        });

        this.diff(this.state.screens, prevState.screens).forEach(newScreen => {

            console.info(`Rendering ${newScreen.af_componentId}`);

            Core.render(newScreen.af_componentRoot(),
                        document.getElementById(`screen-container-${newScreen.af_componentId}`),
                        () => console.info(`Rendered ${newScreen.af_componentId}`));
        });
    }

    componentWillUnmount(): void {
        this.state.screens.forEach(screen => {
            console.info(`Shutting down ${screen.af_componentId}`);
            screen.af_onShutdown();
        });
    }

    render() {
        return (

            <div id={"appformer-js-root"}
                 style={{
                     padding: "10px", fontFamily: "Helvetica", fontWeight: "lighter",
                 }}>

                <h1>Welcome to AppFormer.js</h1>

                <EventsConsolePanel subscriptions={this.subscriptionsOfAllOpenScreens()}/>

                {this.state.screens.map(screen => (

                    <AppFormerJsScreen screen={screen} onClose={() => this.removeScreen(screen)}/>

                ))}
            </div>

        );
    }
}

type AppFormerJsScreenProps = { screen: DefaultAppFormerScreen, onClose: () => void }

class AppFormerJsScreen extends React.Component<AppFormerJsScreenProps, {}> {

    constructor(props: AppFormerJsScreenProps) {
        super(props);
    }

    render() {
        const screen = this.props.screen;
        return <div key={screen.af_componentId}
                    onFocus={() => screen.af_onFocus()}
                    onBlur={() => screen.af_onLostFocus()}
                    style={{
                        borderRadius: "5px",
                        border: "0.5px solid #ccc",
                        marginBottom: "20px",
                        padding: "15px",
                        boxShadow: "0px 5px 8px -4px #ccc",
                    }}>


            <h4 style={{color: "green"}}>
                {screen.af_componentTitle}
                &nbsp;&nbsp;
                <a href="#" onClick={() => this.props.onClose()}>Close</a>
            </h4>

            <div id={`screen-container-${screen.af_componentId}`}>
                {/*Empty on purpose*/}
            </div>
        </div>;
    }
};

//FIXME: fix subscriptions type (Map<String, Consumer<Object>)
type EventsConsolePanelProps = { subscriptions: any }

class EventsConsolePanel extends React.Component<EventsConsolePanelProps, { bang: string, channel?: string }> {

    constructor(props: EventsConsolePanelProps) {
        super(props);
        this.state = {bang: ""};
    }

    componentWillReceiveProps(nextProps: Readonly<EventsConsolePanelProps>, nextContext: any): void {
        this.setState({channel: Object.keys(nextProps.subscriptions)[0] || null});
    }

    render() {
        return (

            <div style={{border: "2px dotted blue", margin: "10px", padding: "10px"}}>

                <h2>Events simulation console</h2>

                {this.state.channel && <>
                    <select onChange={e => this.setState({channel: e.target.value})}
                            value={this.state.channel}>
                        {Object.keys(this.props.subscriptions).map(channel => {
                            return <option key={channel} value={channel}>{channel}</option>
                        })}
                    </select>

                    &nbsp;

                    <input onChange={e => this.setState({bang: e.target.value})}
                           placeholder={"Type bang value"} value={this.state.bang}/>

                    &nbsp;

                    <button onClick={() => this.sendBang()}>
                        Send bang event!
                    </button>
                </>}

                {!this.state.channel && <>
                    <p>No one is listening to events at the moment :(</p>
                </>}
            </div>

        );
    }

    private sendBang() {
        this.props.subscriptions[this.state.channel](this.state.bang);
    }
}

export class AppFormerLink extends React.Component<{ to: string }, {}> {

    go() {
        Core.bridge.goTo(this.props.to);
    }

    render() {
        return (

            <span onClick={() => this.go()}>
                {this.props.children}
            </span>

        );
    }
}

export class ExampleList extends React.Component<{ name: string, id: string }, {}> {
    render() {
        return (

            <div>
                <h4>List of {this.props.name}</h4>
                <ul>
                    <li>Id: {this.props.id}</li>
                    <li>WhatsApp</li>
                    <li>
                        Oculus (and
                        <AppFormerLink to={"TodoListScreen"}>
                            &nbsp;<a href="#">link</a>&nbsp;
                        </AppFormerLink>
                        to the TodoListScreen!)
                    </li>
                </ul>
            </div>

        );
    }
}


export function render(component: any, container: HTMLElement, callback = () => {
}) {


    if (component instanceof HTMLElement) {
        container.innerHTML = "";
        container.appendChild(component);
        callback();
    }

    //FIXME: What's wrong with that?
    else if (typeof component === "string" || component instanceof String) {
        container.innerHTML = "";
        container.innerHTML = (component as string);
        callback();
    }

    else {
        ReactDOM.render(component, container, callback);
    }
}