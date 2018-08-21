import * as AppFormer from "appformer";
import * as React from "react";

export const Link = (props: { to: string; children: any }) => (
  <span onClick={() => AppFormer.goTo(props.to)}>{props.children}</span>
);

export const __i18__ = (props: { tkey: string }) => <>{Core.translate(props.tkey)}</>;

interface Props {
  name: string;
  id: string;
}

// FIXME: This is a temporary component \/
export class ExampleList extends React.Component<Props, {}> {
  public render() {
    return (
      <div>
        <h4>List of {this.props.name}</h4>
        <ul>
          <li>Id: {this.props.id}</li>
          <li>
            <__i18__ tkey={"message.that.should.be.translated"} />
          </li>
          <li>
            Oculus (and
            <Link to={"TodoListScreen"}>
              &nbsp;
              <a href="#">link</a>
              &nbsp;
            </Link>
            to the TodoListScreen!)
          </li>
          <li>
            <Link to={"dom-elements-screen"}>
              <a href="#">Open DOM Elements screen</a>
              &nbsp;
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
