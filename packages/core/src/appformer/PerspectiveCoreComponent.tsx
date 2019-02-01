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

import { Component } from "../core";
import { Element } from "../core";
import { Perspective } from "./Perspective";
import { AppFormer } from "./AppFormer";
import { ComponentTypes } from "./ComponentTypes";

export class PerspectiveCoreComponent extends Component {
  public readonly perspective: Perspective;
  private readonly appformer: AppFormer;

  constructor(perspective: Perspective, appformer: AppFormer) {
    super({ type: ComponentTypes.PERSPECTIVE, core_componentId: perspective.af_componentId});
    this.perspective = perspective;
    this.appformer = appformer;
    this.af_isReact = perspective.af_isReact;
    this.af_hasContext = perspective.af_hasContext;
  }

  //FIXME: Execute goTo for all _components at once. This will speed up React's reconciliation
  //FIXME: by changing the state only once.
  public core_onReady(): void {
    this._components.forEach(id => this.appformer.goTo(id));
    this.perspective.af_onOpen();
  }

  public core_onVanished(): void {
    this.perspective.af_onClose();
  }

  public core_componentRoot(children?: any): Element {
    return this.perspective.af_componentRoot(children);
  }
}
