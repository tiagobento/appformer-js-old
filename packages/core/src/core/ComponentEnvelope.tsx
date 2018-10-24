import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component } from "./Component";
import { Core } from "./Core";
import { CoreRootContextValue } from "./CoreRoot";

interface Props {
  component: Component;
  rootContext: CoreRootContextValue;
  core: Core;
}

interface State {
  portaledComponents: Component[];
}

export class ComponentEnvelope extends React.Component<Props, State> {
  public static AfOpenComponentAttr = "af-js-open-component";
  public static AfComponentAttr = "af-js-component";

  private ref: HTMLElement;
  private mutationObserver?: MutationObserver;

  constructor(props: Props) {
    super(props);
    this.state = { portaledComponents: [] };
  }

  public componentDidMount(): void {
    if (!this.props.component.isReact) {
      this.props.core.render(this.props.component.af_componentRoot(), this.ref);
    }
    this.refreshPortaledComponents();
    console.info(`Mounted ${this.props.component.af_componentId}`);
  }

  public updateRef(newRef: HTMLElement | null) {
    if (newRef) {
      this.ref = newRef;
      this.updateMutationObserver();
    }
  }

  private updateMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.mutationObserver = new MutationObserver(mutations => {
      const containers = this.findContainers(
        ([] as Node[])
          .concat(...mutations.map(m => Array.from(m.addedNodes)))
          .filter(node => node.nodeName === "DIV")
          .map(node => node as HTMLElement)
          .filter(elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr))
          .map(elem => elem.getAttribute(ComponentEnvelope.AfComponentAttr)!)
      );

      const addedNodes = ([] as HTMLElement[])
        .concat(...containers)
        .filter(container => !container.hasAttribute(ComponentEnvelope.AfOpenComponentAttr));

      if (addedNodes.length > 0) {
        console.info("-> Refresh was triggered by the Mutation Observer");
        this.refreshPortaledComponents();
      }
    });

    this.mutationObserver!.observe(this.ref, {
      childList: true,
      subtree: true
    });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props !== prevProps) {
      this.refreshPortaledComponents();
    }
  }

  public componentWillUnmount(): void {
    if (this.mutationObserver) {
      this.mutationObserver!.disconnect();
    }

    console.info(`Unmounting ${this.props.component.af_componentId}`);
  }

  private refreshPortaledComponents() {
    this.setState({
      portaledComponents: Array.from(
        new Set(
          this.findContainers(Object.keys(this.props.rootContext.components)).map(
            c => this.props.rootContext.components[c.getAttribute(ComponentEnvelope.AfComponentAttr)!]
          )
        )
      )
    });
  }

  private makePortal(component: Component): JSX.Element {
    const container = this.findContainers([component.af_componentId])[0];
    container.setAttribute(ComponentEnvelope.AfOpenComponentAttr, component.af_componentId);
    return ReactDOM.createPortal(
      <ComponentEnvelope rootContext={this.props.rootContext} core={this.props.core} component={component} />,
      container,
      component.af_componentId
    );
  }

  public findContainers(af_componentIds: string[]) {
    return searchTree(
      this.ref,
      elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr),
      elem => af_componentIds.indexOf(elem.getAttribute(ComponentEnvelope.AfComponentAttr)!) !== -1
    );
  }

  public render() {
    const portals = this.state.portaledComponents.map(component => this.makePortal(component));

    return (
      <div ref={ref => this.updateRef(ref)} className={"af-js-component"}>
        {this.props.component.isReact && this.props.component.af_componentRoot(portals)}
        {!this.props.component.hasContext && portals}
      </div>
    );
  }
}

function searchTree(
  root: HTMLElement,
  stopWhen: (elem: HTMLElement) => boolean,
  accept: (elem: HTMLElement) => boolean
): HTMLElement[] {
  let node: any;

  const stack = [root];
  stack.push(root);

  const ret = new Set();

  while (stack.length > 0) {
    node = stack.pop()!;
    if (node instanceof HTMLElement && stopWhen(node)) {
      if (accept(node)) {
        ret.add(node);
      }
    } else if (node.children && node.children.length) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }

  return Array.from(ret);
}
