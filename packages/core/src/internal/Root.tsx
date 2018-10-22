import * as React from "react";
import { JsBridge } from "./JsBridge";
import { PerspectiveEnvelope } from "./PerspectiveEnvelope";
import { GenericComponent } from "../api/Components";
import { Perspective } from "../api/Perspective";
import { Screen } from "../api/Screen";

interface Props {
  exposing: (self: () => Root) => void;
  bridge: JsBridge;
}

export class State {
  public currentPerspective?: Perspective;
  public perspectives: Perspective[];
  public screens: Screen[];
  public openScreens: Screen[];
  public hasAnOpen: (component: GenericComponent) => boolean;
  public without: (screenId: string) => State;

  public static hasAnOpen = (state: State) => (component: GenericComponent) => {
    return component instanceof Screen
      ? state.openScreens.indexOf(component) > -1
      : state.currentPerspective === component;
  };

  public static without = (state: State) => (screenId: string) => ({
    ...state,
    openScreens: state.openScreens.filter(s => s.af_componentId !== screenId)
  });
}

const actions = {
  registerPerspective: (perspective: Perspective) => (state: State): any => ({
    perspectives: [...state.perspectives, perspective],
    currentPerspective: state.currentPerspective
      ? state.currentPerspective
      : perspective.af_isDefault
        ? perspective //First registered default perspective stays.
        : undefined,
    openScreens: state.currentPerspective
      ? state.openScreens
      : perspective.af_isDefault
        ? state.screens.filter(screen => perspective.has(screen))
        : []
  }),

  registerScreen: (screen: Screen) => (state: State): any => {
    return {
      screens: [...state.screens, screen],
      openScreens:
        state.currentPerspective && state.currentPerspective!.has(screen)
          ? [...state.openScreens, screen]
          : state.openScreens
    };
  },

  open: (af_componentId: string, container?: HTMLElement) => (state: State): any => {
    const perspective = state.perspectives.filter(p => p.af_componentId === af_componentId).pop();
    if (perspective) {
      return actions.openPerspective(perspective!)(state);
    } else {
      return actions.openScreen(af_componentId, container)(state);
    }
  },

  openPerspective: (perspective: Perspective) => (state: State): any => {
    const uncloseableScreens = state.openScreens
      .filter(screen => !perspective.has(screen)) // Filters out screens that will remain open
      .map(s => ({ screen: s, canBeClosed: s.af_onMayClose() }))
      .filter(t => !t.canBeClosed)
      .map(t => t.screen.af_componentId);

    // FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
    const msg = `[${uncloseableScreens}] cannot be closed at the moment. Force closing and proceed to ${
      perspective.af_componentId
    }?`;
    if (uncloseableScreens.length > 0 && !confirm(msg)) {
      return state;
    }

    return {
      currentPerspective: perspective,
      openScreens: state.screens.filter(screen => perspective.has(screen))
    };
  },

  closeScreen: (screen: Screen) => (state: State): any => {
    // FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
    const msg = `${screen.af_componentId} cannot be closed. Do you want to force it?`;
    if (!screen.af_onMayClose() && !confirm(msg)) {
      return state;
    }

    return { openScreens: state.openScreens.filter(s => s !== screen) };
  },

  openScreen: (af_componentId: string, container?: HTMLElement) => (state: State): any => {
    const screen = state.screens.filter(s => s.af_componentId === af_componentId).pop();
    if (!screen) {
      console.error(`No screen found with id ${af_componentId}.`);
      return state;
    }

    if (!container) {
      console.error(
        `Could not render [${screen.af_componentId}]. No suitable container on perspective [${
          state.currentPerspective!.af_componentId
        }]. Add a specific or default component container to your perspective and try again.`
      );
      return state;
    }

    if (state.hasAnOpen(screen)) {
      console.info(`Screen ${screen.af_componentId} is already open.`);
      return;
    }

    const existingComponentId = container.getAttribute(PerspectiveEnvelope.AfOpenComponentAttr);
    if (existingComponentId) {
      // FIXME: Not checking onMayClose to close the existing screen
      return {
        openScreens: [...state.without(existingComponentId).openScreens, screen]
      };
    }

    return { openScreens: [...state.openScreens, screen] };
  }
};

const defaultState = {
  currentPerspective: undefined,
  perspectives: [],
  screens: [],
  openScreens: [],
  hasAnOpen(c: any) {
    return State.hasAnOpen(this)(c);
  },
  without(c: any) {
    return State.without(this)(c);
  }
};

export const RootContext = React.createContext<State>(defaultState);
export type RootContextValue = State;

export class Root extends React.Component<Props, State> {
  private perspectiveEnvelope: PerspectiveEnvelope;

  constructor(props: Props) {
    super(props);
    this.state = defaultState;
    this.props.exposing(() => this);
  }

  public registerScreen(screen: Screen) {
    this.setState(actions.registerScreen(screen));
  }

  public registerPerspective(perspective: Perspective) {
    this.setState(actions.registerPerspective(perspective));
  }

  public open(place: string) {
    this.setState(actions.open(place, this.perspectiveEnvelope.findContainerFor(place)));
  }

  public close(screen: Screen) {
    this.setState(actions.closeScreen(screen), () => {
      this.perspectiveEnvelope
        .findContainerFor(screen.af_componentId)!
        .removeAttribute(PerspectiveEnvelope.AfOpenComponentAttr);
    });
  }

  public componentDidUpdate(pp: Readonly<Props>, ps: Readonly<State>, snapshot?: any): void {
    console.info("=======================");
  }

  public componentWillUnmount() {
    this.state.screens.forEach(screen => {
      console.info(`...Shutting down ${screen.af_componentId}...`);
      screen.af_onShutdown();
      console.info(`Shut down ${screen.af_componentId}.`);
    });
  }

  public render() {
    return (
      <div className={"af-js-root"}>
        <RootContext.Provider value={this.state}>
          {this.state.currentPerspective && (
            <PerspectiveEnvelope
              key={this.state.currentPerspective!.af_componentId}
              exposing={ref => (this.perspectiveEnvelope = ref())}
              root={this.state}
              bridge={this.props.bridge}
              perspective={this.state.currentPerspective!}
            />
          )}
        </RootContext.Provider>
      </div>
    );
  }
}
