import * as React from "react";
import { Screen, Perspective, DefaultScreenContainerId } from "appformer/Components";
import JsBridge from "appformer/internal/JsBridge";

interface Props {
  root: { ss: Screen[]; ps: Perspective[] };
  screen: Screen;
  onClose: () => void;
  bridge: JsBridge;
}

export default class ScreenContainer extends React.Component<Props, {}> {
  private ref: HTMLDivElement;

  public componentDidMount(): void {
    if (!this.props.screen.isReact) {
      console.info(`...Rendering ${this.props.screen.af_componentId}...`);
      this.props.bridge.render(this.props.screen.af_componentRoot(this.props.root), this.ref);
      console.info(`Rendered ${this.props.screen.af_componentId}`);
    }

    console.info(`...Opening ${this.props.screen.af_componentId}...`);
    this.props.screen.af_onOpen();
    console.info(`Opened ${this.props.screen.af_componentId}.`);
  }

  public componentWillUnmount(): void {
    console.info(`...Closing ${this.props.screen.af_componentId}...`);
    this.props.screen.af_onClose();
    console.info(`Closed ${this.props.screen.af_componentId}.`);
  }

  public render() {
    return (
      <div
        className={"af-screen-container"}
        onFocus={() => this.props.screen.af_onFocus()}
        onBlur={() => this.props.screen.af_onLostFocus()}
      >
        {this.props.screen.af_componentTitle && <div className={"title"}>{this.TitleBar(this.props.screen)}</div>}

        {/*This is where the screens will be rendered on.*/}
        {/*If it is a ReactElement we can embedded it directly*/}
        {this.props.screen.isReact && this.props.screen.af_componentRoot(this.props.root)}

        {/*If not, we simply add a container div where the component will be rendered on */}
        {/*See: componentDidMount*/}
        {!this.props.screen.isReact && <div ref={e => (this.ref = e!)}>{/*Container*/}</div>}
      </div>
    );
  }

  private TitleBar(screen: Screen) {
    return (
      <span>
        <span>{screen.af_componentTitle}</span>
        &nbsp;&nbsp;
        <a href="#" onClick={() => this.props.onClose()}>
          Close
        </a>
      </span>
    );
  }
}
