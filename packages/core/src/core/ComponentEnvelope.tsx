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

enum Ready {
  NOPE,
  ALMOST,
  YEP
}

interface State {
  portaledComponents: Component[];
  ready: Ready;
}

export class ComponentEnvelope extends React.Component<Props, State> {
  public static AfOpenComponentAttr = "af-js-open-component";
  public static AfComponentAttr = "af-js-component";

  private ref: HTMLElement;
  private mutationObserver?: MutationObserver;

  constructor(props: Props) {
    super(props);
    this.state = { portaledComponents: [], ready: Ready.NOPE };
  }

  public componentDidMount(): void {
    if (!this.props.component.isReact) {
      this.props.core.render(this.props.component.core_componentRoot(), this.ref);
    }
    this.refreshPortaledComponents();
    console.info(`Mounted ${this.props.component.af_componentId}`);
  }

  public updateReactRef(newRef: HTMLElement | null) {
    if (newRef && newRef.parentElement) {
      this.ref = newRef.parentElement;
      this.updateMutationObserver();
    }
  }

  public updateNonReactRef(newRef: HTMLElement | null) {
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
      const af_componentIds = flatten(mutations.map(m => Array.from(m.addedNodes)))
        .filter(node => node.nodeName === "DIV")
        .map(node => node as HTMLElement)
        .filter(elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr))
        .map(elem => elem.getAttribute(ComponentEnvelope.AfComponentAttr)!);

      const addedNodes = this.findContainers(af_componentIds).filter(
        c => !c.hasAttribute(ComponentEnvelope.AfOpenComponentAttr)
      );

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
    } else if (this.state.ready === Ready.ALMOST) {
      this.props.component.core_onReady();
    }
  }

  public componentWillUnmount(): void {
    if (this.mutationObserver) {
      this.mutationObserver!.disconnect();
    }

    console.info(`Unmounted ${this.props.component.af_componentId}`);
    this.props.component.core_onVanished();
  }

  private refreshPortaledComponents() {
    this.setState(prevState => ({
      ready: prevState.ready === Ready.NOPE ? Ready.ALMOST : Ready.YEP,
      portaledComponents: Array.from(
        new Set(
          this.findContainers(Object.keys(this.props.rootContext.components)).map(
            c => this.props.rootContext.components[c.getAttribute(ComponentEnvelope.AfComponentAttr)!]
          )
        )
      )
    }));
  }

  private makePortal(component: Component): JSX.Element {
    const container = this.findContainers([component.af_componentId])[0];
    container.setAttribute(ComponentEnvelope.AfOpenComponentAttr, component.af_componentId);
    const envelope = (
      <ComponentEnvelope rootContext={this.props.rootContext} core={this.props.core} component={component} />
    );

    //FIXME: What about multiple instances of the same component?
    return ReactDOM.createPortal(envelope, container, component.af_componentId);
  }

  public findContainers(af_componentIds: string[]) {
    return searchTree({
      root: this.ref,
      stopWhen: elem => elem.hasAttribute(ComponentEnvelope.AfComponentAttr),
      accept: elem => af_componentIds.indexOf(elem.getAttribute(ComponentEnvelope.AfComponentAttr)!) !== -1
    });
  }

  public render() {
    const portals = this.state.portaledComponents.map(component => this.makePortal(component));
    return this.props.component.isReact ? (
      <>
        <div ref={ref => this.updateReactRef(ref)} />
        {!this.props.component.hasContext && portals}
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

  const ret = new Set();

  while (stack.length > 0) {
    node = stack.pop()!;
    if (node !== root && node instanceof HTMLElement && stopWhen(node)) {
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
