import * as React from "react";
import { DefaultScreenContainerId, Perspective, Screen } from "../api/Components";

interface Props {
  perspective: Perspective;
}

export class PerspectiveEnvelope extends React.Component<Props, {}> {
  public static AfOpenScreenAttr = "af-open-screen";

  public ref: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = { ready: false };
  }

  public render() {
    return (
      <div
        className={"af-perspective-container"}
        ref={e => (this.ref = e!)}
        key={this.props.perspective.af_componentId}
        id={PerspectiveEnvelope.getSelfContainerElementId(this.props.perspective)}
      >
        {/*This is where the perspective will be rendered on.*/}
        {/*See `componentDidMount` and `componentWillUnmount`*/}
        {/*If it is a ReactElement we can embedded it directly*/}
        {this.props.perspective.isReact && this.props.perspective.af_perspectiveRoot()}
      </div>
    );
  }

  private static getSelfContainerElementId(perspective: Perspective) {
    return "self-perspective-" + perspective.af_componentId;
  }

  public static findContainerFor(screen: Screen, perspective: Perspective) {
    const ref = document.getElementById(this.getSelfContainerElementId(perspective))!;
    return this.findScreenContainerInside(screen, ref);
  }

  private static findScreenContainerInside(screen: Screen, root: HTMLElement) {
    return searchTree(root, Screen.containerId(screen.af_componentId)) || searchTree(root, DefaultScreenContainerId);
  }
}

function searchTree(root: HTMLElement, id: string) {
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

  return null;
}
