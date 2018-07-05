import * as React from "react";

export function testComponent(): HTMLDivElement {
    let div = document.createElement("div");
    div.textContent = foo();
    div.style.color = "red";
    return div;
}

export function foo(): string {
    return "1234567890";
}


export class ShoppingList extends React.Component<{ name: string, number: string }, {}> {
    render() {
        return (
            <div className="shopping-list">
                <h1>Shopping List for {this.props.name}</h1>
                <ul>
                    <li>{this.props.number}</li>
                    <li>WhatsApp</li>
                    <li>Oculus</li>
                </ul>
            </div>
        );
    }
}