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
import { DefaultComponentContainerId } from "./Components";
import { AppFormerContext } from "./AppFormerRoot";

export const Link = (props: { to: string; children: any }) => (
  <AppFormerContext.Consumer>
    {appformer => <span onClick={() => appformer.api!.goTo(props.to)}>{props.children}</span>}
  </AppFormerContext.Consumer>
);

export const __i18n = (props: { tkey: string; args: string[] }) => (
  <AppFormerContext.Consumer>
    {appformer => <React.Fragment>{appformer.api!.translate(props.tkey, props.args)}</React.Fragment>}
  </AppFormerContext.Consumer>
);

export const DefaultComponentContainer = () => {
  return <div id={DefaultComponentContainerId} />;
};
