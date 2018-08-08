import * as React from "react";
import {goTo} from "core/API";

export class AppFormerLink extends React.Component<{ to: string }, {}> {

    go() {
        goTo(this.props.to);
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