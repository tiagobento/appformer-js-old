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
import { Screen } from "./Screen";
import { ComponentTypes } from "./ComponentTypes";

export class ScreenCoreComponent extends Component {
  public readonly screen: Screen;

  constructor(screen: Screen) {
    super({ type: ComponentTypes.SCREEN, core_componentId: screen.af_componentId });
    this.screen = screen;
    this.af_isReact = screen.af_isReact;
    this.af_hasContext = screen.af_hasContext;
  }

  public core_onReady(): void {
    this.screen.af_onOpen();
  }

  public core_onVanished(): void {
    this.screen.af_onClose();
  }

  public core_componentRoot(children?: any): Element {
    return this.screen.af_componentRoot(children);
  }
}
