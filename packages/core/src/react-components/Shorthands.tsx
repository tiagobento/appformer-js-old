import * as API from "../";
import * as React from "react";
import { DefaultComponentContainerId, Screen } from "../api/Components";

export const Link = (props: { to: string; children: any }) => (
  <span onClick={() => API.goTo(props.to)}>{props.children}</span>
);

export const __i18n = (props: { tkey: string; args: string[] }) => (
  <React.Fragment>{API.translate(props.tkey, props.args)}</React.Fragment>
);

export const DefaultComponentContainer = () => {
  return <div id={DefaultComponentContainerId} />;
};

export const ComponentContainer = (props: { af_componentId: string }) => {
  return <div id={Screen.containerId(props.af_componentId)} />;
};
