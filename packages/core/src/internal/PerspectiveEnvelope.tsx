import * as React from "react";
import * as ReactDOM from "react-dom";
import { DefaultComponentContainerId, Perspective, Screen } from "../api/Components";
import { ScreenEnvelope } from "./ScreenEnvelope";
import { JsBridge } from "./JsBridge";

interface Props {
  perspective: Perspective;
  openScreens: Screen[];
  exposing: (self: () => PerspectiveEnvelope) => void;
  bridge: JsBridge;
}

interface State {
  portaledScreens: Screen[];
}

export class PerspectiveEnvelope extends React.Component<Props, State> {
  public static AfOpenComponentAttr = "af-js-open-component";
  private ref: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = { portaledScreens: [] };
    this.props.exposing(() => this);
  }

  public componentDidMount(): void {
    if (!this.props.perspective.isReact) {
      this.props.bridge.render(this.props.perspective.af_perspectiveRoot(), this.ref);
    }
    this.refreshPortaledScreens();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.openScreens !== prevProps.openScreens) {
      this.refreshPortaledScreens();
    }
  }

  private refreshPortaledScreens() {
    this.setState({ portaledScreens: this.props.openScreens });
  }

  private makePortal(screen: Screen) {
    const container = this.findContainerFor(screen.af_componentId);

    if (!container) {
      console.error(`A container for ${screen.af_componentId} should exist at this point for sure.`);
    } else {
      container.setAttribute(PerspectiveEnvelope.AfOpenComponentAttr, screen.af_componentId);
    }

    return (
      <React.Fragment key={screen.af_componentId}>
        {container && ReactDOM.createPortal(<ScreenEnvelope bridge={this.props.bridge} screen={screen} />, container!)}
      </React.Fragment>
    );
  }

  public findContainerFor(af_componentId: string) {
    return (
      searchTree(this.ref, Screen.containerId(af_componentId)) || searchTree(this.ref, DefaultComponentContainerId)
    );
  }

  public render() {
    return (
      <div ref={r => (this.ref = r!)} className={"af-perspective-container"}>
        {/*This is where the perspective will be rendered on.*/}
        {/*If it is a ReactElement we can embedded it directly*/}
        {this.props.perspective.isReact && this.props.perspective.af_perspectiveRoot()}

        {/*Make portals to container divs*/}
        {this.state.portaledScreens.map(screen => this.makePortal(screen))}
      </div>
    );
  }
}

//Do not traverse inside a container divs
function searchTree(root: HTMLElement, id: string): HTMLElement | undefined {
  let node: any;

  const stack = [root];
  stack.push(root);

  while (stack.length > 0) {
    node = stack.pop()!;
    if (node instanceof HTMLElement && (node as HTMLElement).id === id) {
      return node;
    } else if (node.children && node.children.length) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }

  return undefined;
}
