import * as React from "react";


export function foo(): string {
    return "1234567890";
}

export class ExampleList extends React.Component<{ name: string, id: string }, {}> {
    render() {
        return (
            <div>
                <h4>List of {this.props.name}</h4>
                <ul>
                    <li>Id: {this.props.id}</li>
                    <li>WhatsApp</li>
                    <li>Oculus</li>
                </ul>
            </div>
        );
    }
}