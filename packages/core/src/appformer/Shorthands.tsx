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
