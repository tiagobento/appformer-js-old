import * as API from "../";
import * as React from "react";
import { DefaultScreenContainerId, Screen } from "../api/Components";
import { ScreenEnvelope } from "../internal/ScreenEnvelope";
import { RootContext, State } from "../internal/Root";

export const Link = (props: { to: string; children: any }) => (
  <span onClick={() => API.goTo(props.to)}>{props.children}</span>
);

export const __i18n = (props: { tkey: string; args: string[] }) => <>{API.translate(props.tkey, props.args)}</>;

export const DefaultScreenContainer = () => {
  function screenPart(rootContext: State) {
    const screen = rootContext.openScreens
      .filter(s => rootContext.currentPerspective!.af_perspectiveScreens.indexOf(s.af_componentId) === -1)
      .pop();

    return !screen ? (
      <div id={DefaultScreenContainerId} />
    ) : (
      <div id={DefaultScreenContainerId} af-open-screen={screen.af_componentId}>
        <ScreenEnvelope key={screen.af_componentId} screen={screen} />
      </div>
    );
  }

  return <RootContext.Consumer>{rootContext => screenPart(rootContext)}</RootContext.Consumer>;
};

export const ScreenContainer = (props: { af_componentId: string }) => {
  function screenPart(rootContext: State) {
    const screen = rootContext.openScreens.filter(s => s.af_componentId === props.af_componentId).pop();
    return !screen ? (
      <div id={Screen.containerId(props.af_componentId)} />
    ) : (
      <div id={Screen.containerId(screen.af_componentId)} af-open-screen={screen.af_componentId}>
        <ScreenEnvelope key={screen.af_componentId} screen={screen} />
      </div>
    );
  }

  return <RootContext.Consumer>{rootContext => screenPart(rootContext)}</RootContext.Consumer>;
};
