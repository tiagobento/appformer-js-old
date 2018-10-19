import * as API from "../";
import * as React from "react";

export const Link = (props: { to: string; children: any }) => (
  <span onClick={() => API.goTo(props.to)}>{props.children}</span>
);

export const __i18n = (props: { tkey: string, args: string[]}) => <>{API.translate(props.tkey, props.args)}</>;

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
            <__i18n tkey={"message.that.should.be.translated"} args={[]}/>
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
