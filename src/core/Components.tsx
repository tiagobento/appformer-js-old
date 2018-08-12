import * as React from "react";
import * as Core from "core";

export namespace AppFormer {

    export type Subscriptions = { [channel: string]: (m: any) => void };

    export abstract class Screen {

        af_componentId: string;
        af_componentTitle: string;
        af_subscriptions: () => Subscriptions; //FIXME: maybe this one should be a method?

        af_onOpen(): void {
        }

        af_onFocus(): void {
        }

        af_onLostFocus(): void {
        }

        af_onMayClose(): boolean {
            return true;
        }

        af_onClose(): void {
        }

        af_onShutdown(): void {
        }

        abstract af_componentRoot(): any;

    }

    export abstract class Perspective {
        id: string;
        screens: string[];
        default: boolean;

        has(screen: AppFormer.Screen | string) {
            const id = typeof screen === 'string' ? screen : screen.af_componentId;
            return this.screens.indexOf(id) > -1;
        }
    }

    export const Link = (props: { to: string, children: any }) => (
        <span onClick={() => Core.goTo(props.to)}>
            {props.children}
        </span>);

    //FIXME: This is temporary \/
    export class ExampleList extends React.Component<{ name: string, id: string }, {}> {
        render() {
            return <div>
                <h4>List of {this.props.name}</h4>
                <ul>
                    <li>Id: {this.props.id}</li>
                    <li>WhatsApp</li>
                    <li>
                        Oculus (and
                        <Link to={"TodoListScreen"}>
                            &nbsp;<a href="#">link</a>&nbsp;
                        </Link>
                        to the TodoListScreen!)
                    </li>
                    <li>
                        <Link to={"dom-elements-screen"}>
                            <a href="#">Open DOM Elements screen</a>&nbsp;
                        </Link>
                    </li>
                </ul>
            </div>;
        }
    }
}