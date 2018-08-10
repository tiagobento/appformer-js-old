import * as React from "react";
import * as Core from "core";

export namespace AppFormer {

    export abstract class Screen {

        af_componentId: string;
        af_componentTitle: string;
        af_subscriptions: () => any; //FIXME: maybe this one should be a method? Also fix its type

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
                </ul>
            </div>;
        }
    }
}