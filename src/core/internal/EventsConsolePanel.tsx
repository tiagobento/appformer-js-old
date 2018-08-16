import {AppFormer} from "core/Components";
import * as React from "react";



interface Props {
    screens: AppFormer.Screen[];
}



interface State {
    event: string;
    channel?: string
}



const actions = {
    "setChannel": (channel: string) => (state: State) => ({channel: channel}),
    "setEvent": (event: string) => (state: State) => ({event: event}),
};


export default class EventsConsolePanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {event: ""};
    }


    subscriptions(props = this.props) {
        //FIXME: There's probably a much better way to do that without increasing the stack size too much.

        let all: AppFormer.Subscriptions = {};

        props.screens
            .filter(s => s.af_subscriptions)
            .map(s => s.af_subscriptions)
            .forEach(subscription => {
                for (const channel in subscription) {
                    if (subscription.hasOwnProperty(channel)) {
                        if (!all[channel]) {
                            all[channel] = subscription[channel];
                        } else {
                            const prev = all[channel];
                            all[channel] = (event: any) => {
                                prev(event);
                                subscription[channel](event);
                            };
                        }
                    }
                }
            });

        return all;
    }


    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.setState({channel: Object.keys(this.subscriptions(nextProps)).sort()[0] || undefined});
    }


    private sendEvent() {
        if (this.state.channel) {
            this.subscriptions()[this.state.channel!](this.state.event);
        }
    }


    render() {
        return <div className={"af-events-console"}>

            <div className={"title"}>
                <span>Events simulation console</span>
            </div>

            <div className={"contents"}>
                {this.state.channel && <>

                    <select value={this.state.channel}
                            onChange={e => this.setState(actions.setChannel(e.target.value))}>

                        {Object.keys(this.subscriptions()).sort().map(channel => {
                            return <option key={channel} value={channel}>{channel}</option>;
                        })}

                    </select>

                    &nbsp;

                    <input onChange={e => this.setState(actions.setEvent(e.target.value))}
                           placeholder={"Type event value"}
                           value={this.state.event}/>

                    &nbsp;

                    <button onClick={() => this.sendEvent()}>
                        Send event!
                    </button>
                </> || <>
                     <span>No one is listening to events at the moment :(</span>
                 </>}
            </div>
        </div>;
    }
}