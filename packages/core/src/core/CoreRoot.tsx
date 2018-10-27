import * as React from "react";
import { Core } from "./Core";
import { ComponentEnvelope } from "./ComponentEnvelope";
import { Component } from "./Component";

interface Props {
  exposing: (ref: () => CoreRoot) => void;
  app: Component;
  core: Core;
}

interface State {
  components: Component[];
}

export interface ComponentMap {
  [af_componentId: string]: Component;
}

export interface CoreRootContextValue {
  components: ComponentMap;
}

export const CoreRootContext = React.createContext<CoreRootContextValue>({ components: {} });
export const CoreContext = React.createContext<Core | undefined>(undefined);

export class CoreRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { components: [] };
    this.props.exposing(() => this);
  }

  public register(...components: Component[]) {
    //TODO: Optimize this search
    this.setState(prevState => {
      const existingIds = prevState.components.map(c => c.core_componentId);
      const newComponents = components.filter(c => existingIds.indexOf(c.core_componentId) === -1);
      return { components: [...prevState.components, ...newComponents] };
    });
  }

  public deregister(...ids: string[]) {
    //TODO: Optimize this search
    this.setState(prevState => {
      return { components: prevState.components.filter(c => ids.indexOf(c.core_componentId) === -1) };
    });
  }

  private buildContext() {
    const merge = (map: ComponentMap, component: Component) => {
      map[component.core_componentId] = component;
      return map;
    };
    return { components: this.state.components.reduce(merge, {} as ComponentMap) };
  }

  public render() {
    const rootContext = this.buildContext();
    return (
      <CoreContext.Provider value={this.props.core}>
        <CoreRootContext.Provider value={rootContext}>
          <ComponentEnvelope core={this.props.core} coreContext={rootContext} component={this.props.app} />
        </CoreRootContext.Provider>
      </CoreContext.Provider>
    );
  }
}
