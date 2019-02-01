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
import { AppFormer } from "./AppFormer";

interface Props {
  exposing: (ref: () => AppFormerRoot) => void;
  appformer: AppFormer;
  portals: any;
}

interface State {
  perspective?: string;
}

export interface AppFormerContextValue extends State {
  api?: AppFormer;
}

export const AppFormerContext = React.createContext<AppFormerContextValue>({
  perspective: undefined,
  api: undefined
});

export class AppFormerRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.exposing(() => this);
    this.state = { perspective: undefined };
  }

  public render() {
    return (
      <div className={"appformer-root"}>
        <AppFormerContext.Provider value={{ ...this.state, api: this.props.appformer }}>
          <div key={this.state.perspective!} af-js-component={this.state.perspective!} />
          {this.props.portals}
        </AppFormerContext.Provider>
      </div>
    );
  }
}
