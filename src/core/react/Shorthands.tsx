import * as Core from "core";
import * as React from "react";
import {AppFormer} from "core/Components";



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



export class Floating extends React.Component {

    ref: HTMLElement;


    componentDidMount(): void {
        (window as any).jQuery(this.ref).draggable(({
            // containment: "parent",

            refreshPositions: true,
        }));
    }


    private resetRefPosition() {
        this.ref.style.bottom = "0";
        this.ref.style.top = "";
    }


    render() {
        return <div ref={e => this.ref = e!} onDoubleClick={() => this.resetRefPosition()} style={{
            minWidth: "450px", position: "absolute", bottom: "0",// border: "1px solid red"
        }}>
            {this.props.children}
        </div>;
    }
}



export class DefaultPerspective extends AppFormer.Perspective {

    constructor() {
        super();
        this.isReact = true;
        this.af_componentId = "default-perspective";
        this.af_perspectiveScreens = [];
        this.af_isDefaultPerspective = true;
    }


    af_perspectiveRoot(): AppFormer.Element {
        return <div id={AppFormer.DefaultScreenContainerId}
                    style={{border: "1px solid black", height: "100%"}}>

        </div>;
    }
}