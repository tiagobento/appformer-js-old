import * as React from "react";
import { Core } from "./Core";
import { ComponentEnvelope } from "./ComponentEnvelope";
import { Component } from "./Component";

interface Props {
  exposing: (ref: () => CoreRoot) => void;
  app: Component;
  core: Core;
}

export class State {
  public components: Component[];
}

export const RootContext = React.createContext<RootContextValue>({ components: {} });
export const CoreContext = React.createContext<Core | undefined>(undefined);
export interface RootContextValue {
  components: { [af_componentId: string]: Component };
}

export class CoreRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { components: [] };
    this.props.exposing(() => this);
  }

  public register(component: Component, type: string) {
    this.setState(prevState => ({ components: [...prevState.components, component] }));
  }

  public componentDidUpdate(pp: Readonly<Props>, ps: Readonly<State>, snapshot?: any): void {
    console.info("=======================");
  }

  public render() {
    const rootContext = {
      components: this.state.components.reduce(
        (map, component) => {
          map[component.af_componentId] = component;
          return map;
        },
        {} as {
          [af_componentId: string]: Component;
        }
      )
    };

    return (
      <CoreContext.Provider value={this.props.core}>
        <RootContext.Provider value={rootContext}>
          <ComponentEnvelope core={this.props.core} rootContext={rootContext} component={this.props.app} />
        </RootContext.Provider>
      </CoreContext.Provider>
    );
  }
}
