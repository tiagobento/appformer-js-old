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
import * as ReactDOM from "react-dom";
import { Element, Component } from "./Component";
import { CoreRoot } from "./CoreRoot";

export class Core {
  public coreRoot: CoreRoot;

  public init(app: Component, container: HTMLElement, callback: () => void) {
    ReactDOM.render(<CoreRoot exposing={ref => (this.coreRoot = ref())} core={this} app={app} />, container, callback);
    return this;
  }

  public register(...components: Component[]) {
    console.info(`Registering ${components.map(c => c.core_componentId).join(", ")}...`);
    this.coreRoot.register(...components);
  }

  public deregister(...ids: string[]) {
    console.info(`Registering ${ids.join(", ")}...`);
    this.coreRoot.deregister(...ids);
  }

  public render(element: Element, container: HTMLElement, callback = (): void => undefined) {
    if (element instanceof HTMLElement) {
      container.innerHTML = ""; //FIXME: Doesn't work well on IE.
      container.appendChild(element);
      callback();
    } else if (typeof element === "string") {
      container.innerHTML = element; //FIXME: Maybe create a Text node and append it?
      callback();
    }
  }
}
