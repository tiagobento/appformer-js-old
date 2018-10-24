import * as React from "react";
import { DefaultComponentContainerId } from "./Components";
import { CoreContext } from "../core/CoreRoot";

export const Link = (props: { to: string; children: any }) => (
  <CoreContext.Consumer>
    {coreContext => <span onClick={() => (coreContext! as any).goTo(props.to)}>{props.children}</span>}
  </CoreContext.Consumer>
);

export const __i18n = (props: { tkey: string; args: string[] }) => (
  <CoreContext.Consumer>
    {coreContext => <React.Fragment>{(coreContext! as any).translate(props.tkey, props.args)}</React.Fragment>}
  </CoreContext.Consumer>
);

export const DefaultComponentContainer = () => {
  return <div id={DefaultComponentContainerId} />;
};