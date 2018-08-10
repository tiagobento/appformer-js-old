import * as React from "react";
import * as Core from "core";
import * as ReactDOM from "react-dom";
import {DefaultAppFormerScreen} from "core/API";

export class AppFormerJsMockBridge {

    screenInclusionFunction: (stateSettingFunction: DefaultAppFormerScreen) => void;

    constructor(callback: () => void) {

        (window as any).asdf = () => ({});
        let appFormerJsRootComponent = <AppFormerJsRoot expose={r => this.screenInclusionFunction = r}/>;
        render(appFormerJsRootComponent, document.getElementById("appformer-root"), callback);
    }

    registerScreen(screen: DefaultAppFormerScreen) {
        this.screenInclusionFunction(screen);

        //FIXME: Just as POC. ideally AppFormer should
        if ((screen as any).af_subscriptions) {
            (window as any).allSubscriptions = {
                ...(window as any).allSubscriptions, ...((screen as any).af_subscriptions())
            };
        }
    }

    goTo(path: string) {
        alert(`Go to ${path} called!`);
    }
}

type AppFormerJsRootProps = { expose: (stateSettingFunction: (s: DefaultAppFormerScreen) => void) => void };

class AppFormerJsRoot extends React.Component<AppFormerJsRootProps, { screens: DefaultAppFormerScreen[] }> {

    constructor(props: AppFormerJsRootProps) {
        super(props);
        this.state = {screens: []};
        this.props.expose((screen: DefaultAppFormerScreen) => {
            this.setState(prevState => ({
                screens: [...prevState.screens, screen]
            }));
        });
    }


    componentDidUpdate(prevProps: Readonly<AppFormerJsRootProps>,
                       prevState: Readonly<{ screens: DefaultAppFormerScreen[] }>,
                       snapshot?: any): void {

        this.state.screens.forEach(screen => {
            let componentContainer = document.getElementById(`screen-container-${screen.af_componentId}`);
            Core.render(screen.af_componentRoot(), componentContainer);
        });
    }

    render() {
        return (

            <div id={"appformer-js-root"}>
                <EventsConsolePanel/>
                {this.state.screens.map(screen => <div key={screen.af_componentId}
                                                       style={{
                                                           border: "2px solid red",
                                                           margin: "0 10px 10px 10px",
                                                           padding: "10px"
                                                       }}>

                    <h4 style={{color: "green"}}>{screen.af_componentTitle}</h4>

                    <div id={`screen-container-${screen.af_componentId}`}>
                        {/*Empty on purpose*/}
                    </div>
                </div>)}
            </div>

        );
    }
}

export class EventsConsolePanel extends React.Component<{}, { bang: string, channel?: string }> {

    constructor(props: {}) {
        super(props);
        this.state = {bang: "0", channel: "bang"};
    }

    render() {
        return (

            <div style={{border: "2px dotted blue", margin: "10px", padding: "10px"}}>
                <h2>Events console</h2>

                <select onChange={(e: any) => this.setState({channel: e.target.value})}>
                    {Object.keys(this.allSubscriptions()).map(channel => {
                        return <option key={channel} value={channel}>{channel}</option>
                    })}
                </select>

                <input type={"text"} onChange={(e: any) => this.setState({bang: e.target.value})}
                       placeholder={"Type bang value"} value={this.state.bang}/>

                <button onClick={() => this.allSubscriptions()[this.state.channel](this.state.bang)}>Send bang event!
                </button>
            </div>

        );
    }

    private allSubscriptions() {
        //FIXME: Get events from all open screens
        const allSubscriptions = (window as any).allSubscriptions;
        return allSubscriptions ? allSubscriptions : {};
    }
}

export class AppFormerLink extends React.Component<{ to: string }, {}> {

    go() {
        Core.bridge.goTo(this.props.to);
    }

    render() {
        return (

            <div onClick={() => this.go()}>
                {this.props.children}
            </div>

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
                        <AppFormerLink to={"TodoListScreen"}>
                            Oculus (and link to the TodoListScreen!)
                        </AppFormerLink>
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