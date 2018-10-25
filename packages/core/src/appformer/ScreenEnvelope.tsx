import * as React from "react";
import { Screen } from "./Components";
import { Element, Component } from "../core";

export class ScreenEnvelope extends Component {
  public readonly type = "screen-envelope";
  private readonly screen: Screen;

  constructor(screen: Screen) {
    super();
    this.isReact = true;
    this.af_componentId = screen.af_componentId;
    this.screen = screen;
  }

  public core_componentRoot(): Element {
    return <ScreenEnvelopeReactComponent screen={this.screen} />;
  }
}

class ScreenEnvelopeReactComponent extends React.Component<{ screen: Screen }, {}> {
  constructor(props: { screen: Screen }) {
    super(props);
  }

  public render() {
    return <div af-js-component={this.props.screen.af_componentId + "-contents"} />;
  }
}
