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

  public register(component: Component) {
    this.setState(prevState => {
      //TODO: Optimize this search
      if (prevState.components.filter(c => c.af_componentId === component.af_componentId).length > 0) {
        return prevState;
      }

      return { components: [...prevState.components, component] };
    });
  }

  public deregister(af_componentId: string) {
    this.setState(prevState => {
      //TODO: Optimize this search
      return { components: prevState.components.filter(c => c.af_componentId !== af_componentId) };
    });
  }

  private buildContext() {
    const merge = (map: ComponentMap, component: Component) => {
      map[component.af_componentId] = component;
      return map;
    };
    return { components: this.state.components.reduce(merge, {} as ComponentMap) };
  }

  public render() {
    const rootContext = this.buildContext();
    return (
      <CoreContext.Provider value={this.props.core}>
        <CoreRootContext.Provider value={rootContext}>
          <ComponentEnvelope core={this.props.core} rootContext={rootContext} component={this.props.app} />
        </CoreRootContext.Provider>
      </CoreContext.Provider>
    );
  }
}
