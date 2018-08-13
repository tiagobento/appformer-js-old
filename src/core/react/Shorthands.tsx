import * as Core from "core";
import * as React from "react";

export const Link = (props: { to: string, children: any }) => <>
    <span onClick={() => Core.goTo(props.to)}>
        {props.children}
    </span>
</>;

//FIXME: This is a temporary component \/
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