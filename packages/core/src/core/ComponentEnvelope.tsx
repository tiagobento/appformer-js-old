import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component } from "./Component";
import { Core } from "./Core";
import { CoreRootContextValue } from "./CoreRoot";

interface DOMSearch {
  visited: HTMLElement[];
  accepted: HTMLElement[];
  visitedIds: string[];
  acceptedIds: string[];
}

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
  private containers: Map<string, HTMLElement>;
  private mutationObserver?: MutationObserver;

  constructor(props: Props) {
    super(props);
    this.state = { portals: [], ready: Ready.NOPE };
  }

  private updateReactRef(newRef: HTMLElement | null) {
    if (newRef && newRef.parentElement) {
      this.updateRef(newRef.parentElement);
    }
  }

  private updateNonReactRef(newRef: HTMLElement | null) {
    if (newRef) {
      this.updateRef(newRef);
    }
  }

  private updateRef(newRef: HTMLElement) {
    this.ref = newRef;
    this.updateComponentContainerRef();
    this.updateMutationObserver();
  }

  private updateComponentContainerRef() {
    (this.props.component._container as any) = this.ref;
  }

  private updateMutationObserver() {
    this.disconnectedMutationObserver();

    this.mutationObserver = new MutationObserver(mutations => {
      this.onMutation(mutations);
    });

    this.mutationObserver!.observe(this.ref, {
      childList: true,
      subtree: true
    });
  }

  private onMutation(mutations: MutationRecord[]) {
    const start = new Date().getTime();
    const addedContainers = flatten(mutations.map(m => Array.from(m.addedNodes)))
      .filter(node => node.nodeName === "DIV")
      .map(node => node as HTMLElement)
      .filter(elem => Boolean(this.getAfComponentAttr(elem)))
      .filter(elem => this.isSubComponentContainer(elem))
      .map(elem => this.containers.get(this.getAfComponentAttr(elem)!))
      .filter(elem => !elem || !elem.hasAttribute(ComponentEnvelope.AfOpenComponentAttr));

    console.info(`Mutation [${new Date().getTime() - start}ms] on "${this.props.component.core_componentId}"`);
    if (addedContainers.length > 0) {
      console.info(`-> Refresh was triggered by the Mutation Observer on "${this.props.component.core_componentId}"`);
      this.refreshPortals();
    }
  }

  private isSubComponentContainer(container: HTMLElement) {
    return searchParents({
      element: container,
      stop: elem => elem === this.ref || Boolean(this.getAfComponentAttr(elem)),
      accept: elem => elem === this.ref
    });
  }

  private disconnectedMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver!.disconnect();
    }
  }

  private refreshPortals() {
    const start = new Date().getTime();
    const search = this.findContainers(Object.keys(this.props.coreContext.components));
    console.info(`Search [${new Date().getTime() - start}ms] on "${this.props.component.core_componentId}"`);

    (this.props.component._components as any) = search.visitedIds;

    this.containers = new Map(
      search.accepted.map<[string, HTMLElement]>(elem => [this.getAfComponentAttr(elem)!, elem])
    );

    this.setState(prevState => ({
      ready: prevState.ready === Ready.NOPE ? Ready.ALMOST : Ready.YEP,
      portals: search.acceptedIds.map(id => this.props.coreContext.components[id])
    }));
  }

  private getAfComponentAttr(container: HTMLElement) {
    return container.getAttribute(ComponentEnvelope.AfComponentAttr);
  }

  private makePortal(component: Component): JSX.Element {
    const container = this.containers.get(component.core_componentId)!;
    container.setAttribute(ComponentEnvelope.AfOpenComponentAttr, component.core_componentId);
    const envelope = (
      <ComponentEnvelope coreContext={this.props.coreContext} core={this.props.core} component={component} />
    );

    //FIXME: What about multiple instances of the same component?
    return ReactDOM.createPortal(envelope, container, component.core_componentId);
  }

  public findContainers(af_componentIds: string[]): DOMSearch {
    const search = searchChildren({
      root: this.ref,
      stopWhen: elem => Boolean(this.getAfComponentAttr(elem)),
      accept: elem => af_componentIds.indexOf(this.getAfComponentAttr(elem)!) !== -1
    });

    return {
      ...search,
      visitedIds: Array.from(new Set(search.visited.map(elem => this.getAfComponentAttr(elem)!))),
      acceptedIds: Array.from(new Set(search.accepted.map(elem => this.getAfComponentAttr(elem)!)))
    };
  }

  public componentDidMount(): void {
    if (!this.props.component.af_isReact) {
      this.props.core.render(this.props.component.core_componentRoot(), this.ref);
    }

    this.refreshPortals();
    console.info(`Mounted ${this.props.component.core_componentId}`);
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
    this.disconnectedMutationObserver();
    this.ref.removeAttribute(ComponentEnvelope.AfOpenComponentAttr);
    console.info(`Unmounted ${this.props.component.core_componentId}`);
    this.props.component.core_onVanished();
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

function searchParents(args: {
  accept: (elem: HTMLElement) => boolean;
  stop: (elem: HTMLElement) => boolean;
  element: HTMLElement;
}) {
  let parent = args.element.parentElement;
  while (parent) {
    if (args.stop(parent)) {
      return args.accept(parent);
    }
    parent = parent.parentElement;
  }
  return false;
}

function searchChildren(args: {
  root: HTMLElement;
  stopWhen: (elem: HTMLElement) => boolean;
  accept: (elem: HTMLElement) => boolean;
}) {
  const { root, stopWhen, accept } = args;
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
