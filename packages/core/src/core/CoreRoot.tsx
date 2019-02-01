/*
 *  Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
