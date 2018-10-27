import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component } from "./Component";
import { Core } from "./Core";
import { CoreRootContextValue } from "./CoreRoot";

interface Props {
  component: Component;
  coreContext: CoreRootContextValue;
  core: Core;
}

enum Ready {
  NOPE,
  ALMOST,
  YEP
}

interface State {
  portals: Component[];
  ready: Ready;
}

export class ComponentEnvelope extends React.Component<Props, State> {
  public static AfOpenComponentAttr = "af-js-open-component";
  public static AfComponentAttr = "af-js-component";

  private ref: HTMLElement;
  private mutationObserver?: MutationObserver;

  constructor(props: Props) {
    super(props);
    this.state = { portals: [], ready: Ready.NOPE };
  }

  public componentDidMount(): void {
    if (!this.props.component.af_isReact) {
      this.props.core.render(this.props.component.core_componentRoot(), this.ref);
    }

    this.refreshPortals();
    console.info(`Mounted ${this.props.component.core_componentId}`);
  }

  public updateReactRef(newRef: HTMLElement | null) {
    if (newRef && newRef.parentElement) {
      this.ref = newRef.parentElement;
      (this.props.component._container as any) = this.ref;
      this.updateMutationObserver();
    }
  }

  public updateNonReactRef(newRef: HTMLElement | null) {
    if (newRef) {
      this.ref = newRef;
      (this.props.component._container as any) = this.ref;
      this.updateMutationObserver();
    }
  }

  private updateMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.mutationObserver = new MutationObserver(mutations => {
      const af_componentIds = flatten(mutations.map(m => Array.from(m.addedNodes)))
        .filter(node => node.nodeName === "DIV")
        .map(node => node as HTMLElement)
        .filter(elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr))
        .map(elem => elem.getAttribute(ComponentEnvelope.AfComponentAttr)!);

      const addedNodes = this.findContainers(af_componentIds).accepted.filter(
        c => !c.hasAttribute(ComponentEnvelope.AfOpenComponentAttr)
      );

      if (addedNodes.length > 0) {
        console.info("-> Refresh was triggered by the Mutation Observer");
        this.refreshPortals();
      }
    });

    this.mutationObserver!.observe(this.ref, {
      childList: true,
      subtree: true
    });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // Components might've been added and/or removed from CoreContext,
    // so we need to refresh the portals.
    if (this.props.coreContext.components !== prevProps.coreContext.components) {
      this.refreshPortals();
    } else if (this.state.ready === Ready.ALMOST) {
      this.props.component.core_onReady();
    }
  }

  public componentWillUnmount(): void {
    if (this.mutationObserver) {
      this.mutationObserver!.disconnect();
    }

    this.ref.removeAttribute(ComponentEnvelope.AfOpenComponentAttr);
    console.info(`Unmounted ${this.props.component.core_componentId}`);
    this.props.component.core_onVanished();
  }

  private refreshPortals() {
    const { visited, accepted } = this.findContainers(Object.keys(this.props.coreContext.components));

    (this.props.component._components as any) = visited.map(
      component => component.getAttribute(ComponentEnvelope.AfComponentAttr)!
    );

    const components = accepted.map(
      component => this.props.coreContext.components[component.getAttribute(ComponentEnvelope.AfComponentAttr)!]
    );

    this.setState(prevState => ({
      ready: prevState.ready === Ready.NOPE ? Ready.ALMOST : Ready.YEP,
      portals: Array.from(new Set(components))
    }));
  }

  private makePortal(component: Component): JSX.Element {
    const container = this.findContainers([component.core_componentId]).accepted[0];
    container.setAttribute(ComponentEnvelope.AfOpenComponentAttr, component.core_componentId);
    const envelope = (
      <ComponentEnvelope coreContext={this.props.coreContext} core={this.props.core} component={component} />
    );

    //FIXME: What about multiple instances of the same component?
    return ReactDOM.createPortal(envelope, container, component.core_componentId);
  }

  public findContainers(af_componentIds: string[]) {
    return searchTree({
      root: this.ref,
      stopWhen: elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr),
      accept: elem => af_componentIds.indexOf(elem.getAttribute(ComponentEnvelope.AfComponentAttr)!) !== -1
    });
  }

  public render() {
    const portals = this.state.portals.map(component => this.makePortal(component));
    return this.props.component.af_isReact ? (
      <>
        <div ref={ref => this.updateReactRef(ref)} />
        {!this.props.component.af_hasContext && portals}
        {this.props.component.core_componentRoot(portals)}
      </>
    ) : (
      <>
        <div ref={ref => this.updateNonReactRef(ref)} />
        {portals}
      </>
    );
  }
}

const flatten = <T extends any>(arr: T[][]) => ([] as T[]).concat(...arr);

function searchTree(parameters: {
  root: HTMLElement;
  stopWhen: (elem: HTMLElement) => boolean;
  accept: (elem: HTMLElement) => boolean;
}) {
  const { root, stopWhen, accept } = parameters;
  let node: any;

  const stack = [root];
  stack.push(root);

  const accepted = new Set();
  const visited = new Set();

  while (stack.length > 0) {
    node = stack.pop()!;
    if (node !== root && node instanceof HTMLElement && stopWhen(node)) {
      if (accept(node)) {
        accepted.add(node);
      }
      visited.add(node);
    } else if (node.children && node.children.length) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }

  return {
    visited: Array.from(visited),
    accepted: Array.from(accepted)
  };
}
