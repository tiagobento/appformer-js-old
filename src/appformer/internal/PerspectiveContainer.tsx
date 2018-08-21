import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Components from "appformer/Components";
import JsBridge from "appformer/internal/JsBridge";
import ScreenContainer from "appformer/internal/ScreenContainer";

interface Props {
  root: { ss: Components.Screen[]; ps: Components.Perspective[] };
  perspective: Components.Perspective;
  screens: Components.Screen[];
  bridge: JsBridge;
  onCloseScreen: (screen: Components.Screen) => void;
}

// tslint:disable-next-line:no-empty-interface
interface State {}

interface KeptScreen {
  screen: Components.Screen;
  container: HTMLElement;
}

interface LastStateSnapshot {
  shouldRenderPerspective: boolean;
  opened: Components.Screen[];
  kept: KeptScreen[];
}

export default class PerspectiveContainer extends React.Component<Props, State> {
  public static AfOpenScreenAttr = "af-open-screen";

  public ref: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = { ready: false };
  }

  public componentDidMount(): void {
    this.componentDidUpdate(this.props, this.state, {
      shouldRenderPerspective: true,
      opened: this.props.screens,
      kept: []
    });
  }

  public getSnapshotBeforeUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): LastStateSnapshot {
    const diff = (a: Components.Screen[], b: Components.Screen[]) => {
      return a.filter(i => b.indexOf(i) < 0);
    };

    const intersect = (a: Components.Screen[], b: Components.Screen[]) => {
      return a.filter(i => -1 !== b.indexOf(i));
    };

    const keptScreens = intersect(this.props.screens, prevProps.screens);
    const openedScreens = diff(diff(this.props.screens, prevProps.screens), keptScreens);
    const closedScreens = diff(diff(prevProps.screens, this.props.screens), keptScreens);

    closedScreens.forEach(screen => this.closeScreen(screen));

    return {
      shouldRenderPerspective: prevProps.perspective !== this.props.perspective,
      kept: keptScreens.map(s => ({
        screen: s,
        container: this.findContainerForScreen(s)!
      })),
      opened: openedScreens
    };
  }

  public componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: LastStateSnapshot
  ): void {
    if (!snapshot!.shouldRenderPerspective) {
      this.renderScreens(snapshot!);
      return;
    }

    if (this.props.perspective.isReact) {
      this.renderScreens(snapshot!);
      return;
    }

    this.props.bridge.render(this.props.perspective.af_perspectiveRoot(this.props.root), this.ref);
    this.renderScreens(snapshot!);
  }

  private renderScreens(snapshot: LastStateSnapshot) {
    snapshot.kept.forEach(kept => this.keepScreen(kept.screen, kept.container));
    snapshot.opened.forEach(screen => this.openScreen(screen));
  }

  private openScreen(screen: Components.Screen) {
    const container = this.findContainerForScreen(screen);
    if (!container) {
      console.error(`[O] A default screen container for ${screen.af_componentId} should exist at this point for sure.`);
      return;
    }

    const screenContainer = (
      <ScreenContainer
        key={screen.af_componentId}
        screen={screen}
        bridge={this.props.bridge}
        root={this.props.root}
        onClose={() => this.props.onCloseScreen(screen)}
      />
    );

    container.setAttribute(PerspectiveContainer.AfOpenScreenAttr, screen.af_componentId);
    ReactDOM.render(screenContainer, container as HTMLElement);
  }

  private keepScreen(screen: Components.Screen, exContainer: HTMLElement) {
    const newContainer = this.findContainerForScreen(screen);
    if (!newContainer) {
      console.error(`[K] A default screen container for ${screen.af_componentId} should exist at this point for sure.`);
      return;
    }

    Array.prototype.slice.call(exContainer.attributes).forEach((a: Attr) => {
      if (!newContainer.hasAttribute(a.name)) {
        exContainer.removeAttribute(a.name);
      } else {
        exContainer.setAttribute(a.name, newContainer.getAttribute(a.name) || "");
      }
    });

    exContainer.setAttribute(PerspectiveContainer.AfOpenScreenAttr, screen.af_componentId);

    // FIXME: this "replaceWith" method does not work on IE.
    (newContainer as any).replaceWith(exContainer);
  }

  private closeScreen(screen: Components.Screen) {
    const container = this.findContainerForScreen(screen);
    if (!container) {
      console.error(`[C] A screen container for ${screen.af_componentId} should exist at this point for sure.`);
      return;
    }

    ReactDOM.unmountComponentAtNode(container);
    container.removeAttribute(PerspectiveContainer.AfOpenScreenAttr);

    // This is very important for React to identify we're dealing with another
    // node when rendering another screen on the same container
    // FIXME: this "replaceWith" method does not work on IE.
    (container as any).replaceWith(container.cloneNode(false));
  }

  private findContainerForScreen(screen: Components.Screen) {
    return PerspectiveContainer.findScreenContainerInside(screen, this.ref);
  }

  public render() {
    return (
      <div
        className={"af-perspective-container"}
        ref={e => (this.ref = e!)}
        key={this.props.perspective.af_componentId}
        id={PerspectiveContainer.getSelfContainerElementId(this.props.perspective)}
      >
        {/*This is where the perspective will be rendered on.*/}
        {/*See `componentDidMount` and `componentWillUnmount`*/}
        {/*If it is a ReactElement we can embedded it directly*/}
        {this.props.perspective.isReact && this.props.perspective.af_perspectiveRoot(this.props.root)}
      </div>
    );
  }

  private static getSelfContainerElementId(perspective: Components.Perspective) {
    return "self-perspective-" + perspective.af_componentId;
  }

  public static findContainerFor(screen: Components.Screen, perspective: Components.Perspective) {
    const ref = document.getElementById(this.getSelfContainerElementId(perspective))!;
    return this.findScreenContainerInside(screen, ref);
  }

  private static findScreenContainerInside(screen: Components.Screen, root: HTMLElement) {
    return (
      searchTree(root, Components.Screen.containerId(screen)) || searchTree(root, Components.DefaultScreenContainerId)
    );
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
