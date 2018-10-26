import * as React from "react";
import { Screen } from "./Screen";
import { AppFormerContext } from "./AppFormerRoot";
import { Element, Component } from "../core";

export class ScreenEnvelope extends Component {
  public readonly screen: Screen;

  constructor(screen: Screen) {
    super({ type: "screen-envelope", core_componentId: screen.af_componentId });
    this.af_isReact = true;
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
    return (
      <div className={"af-screen-container"}>
        {this.props.screen.af_componentTitle && (
          <>
            <div className={"title"}>{this.closeButton()}</div>
          </>
        )}
        <div af-js-component={this.props.screen.af_componentId + "-contents"} />
      </div>
    );
  }

  private closeButton() {
    return (
      <AppFormerContext.Consumer>
        {appformer => (
          <span>
            <span>{this.props.screen.af_componentTitle}</span>
            <a
              href="#"
              style={{ lineHeight: "1.6", float: "right" }}
              onClick={() => appformer.api!.close(this.props.screen.af_componentId)}
            >
              Close
            </a>
          </span>
        )}
      </AppFormerContext.Consumer>
    );
  }
}
