import * as React from "react";
import { JsBridge } from "./JsBridge";
import { PerspectiveContainer } from "./PerspectiveContainer";
import { GenericComponent } from "../api/Components";
import { Perspective } from "../api/Perspective";
import { Screen } from "../api/Screen";

interface Props {
  exposing: (self: () => Root) => void;
  bridge: JsBridge;
}

class State {
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
    openScreens: state.openScreens.filter(s => s.componentId !== screenId)
  });
}

const actions = {
  registerPerspective: (perspective: Perspective) => (state: State): any => ({
    perspectives: [...state.perspectives, perspective],
    currentPerspective: state.currentPerspective
      ? state.currentPerspective
      : perspective.isDefault
        ? perspective // Last default perspective found is the one that wins.
        : undefined,
    openScreens: perspective.isDefault ? state.screens.filter(screen => perspective.has(screen)) : state.openScreens
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

  open: (place: string) => (state: State): any => {
    const perspective = state.perspectives.filter(s => s.componentId === place).pop();
    if (perspective) {
      return actions.openPerspective(perspective!)(state);
    } else {
      return actions.openScreen(place)(state);
    }
  },

  openPerspective: (perspective: Perspective) => (state: State): any => {
    const uncloseableScreens = state.openScreens
      .filter(screen => !perspective.has(screen)) // Filters out screens that will remain open
      .map(s => ({ screen: s, canBeClosed: s.af_onMayClose() }))
      .filter(t => !t.canBeClosed)
      .map(t => t.screen.componentId);

    // FIXME: Using sync "confirm" method is not ideal because it cannot be styled.
    const msg = `[${uncloseableScreens}] cannot be closed at the moment. Force closing and proceed to ${
      perspective.componentId
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
    const msg = `${screen.componentId} cannot be closed. Do you want to force it?`;
    if (!screen.af_onMayClose() && !confirm(msg)) {
      return state;
    }

    return { openScreens: state.openScreens.filter(s => s !== screen) };
  },

  openScreen: (screenId: string) => (state: State): any => {
    const screen = state.screens.filter(x => x.componentId === screenId).pop();
    if (!screen) {
      console.error(`No screen found with id ${screenId}.`);
      return state;
    }

    const container = PerspectiveContainer.findContainerFor(screen, state.currentPerspective!);
    if (!container) {
      console.error(
        `Could not render ${screen.componentId}. No default container for screens found on perspective [${
          state.currentPerspective!.componentId
        }]. Add a div with id \"default-container-for-screens\" to your perspective and try again.`
      );
      return state;
    }

    const existingScreenId = container.getAttribute(PerspectiveContainer.AfOpenScreenAttr);
    if (existingScreenId) {
      // FIXME: Not checking onMayClose to close the existing screen
      return {
        openScreens: [...state.without(existingScreenId).openScreens, screen]
      };
    }

    if (state.hasAnOpen(screen)) {
      console.info(`Screen ${screen.componentId} is already open.`);
      return;
    }

    return { openScreens: [...state.openScreens, screen] };
  }
};

export class Root extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.exposing(() => this);
    this.state = {
      currentPerspective: undefined,
      perspectives: [],
      screens: [],
      openScreens: [],
      hasAnOpen(c) {
        return State.hasAnOpen(this)(c);
      },
      without(c) {
        return State.without(this)(c);
      }
    };
  }

  public registerScreen(screen: Screen) {
    this.setState(actions.registerScreen(screen));
  }

  public registerPerspective(perspective: Perspective) {
    this.setState(actions.registerPerspective(perspective));
  }

  public open(place: string) {
    this.setState(actions.open(place));
  }

  public componentDidUpdate(pp: Readonly<Props>, ps: Readonly<State>, snapshot?: any): void {
    console.info("=======================");
  }

  public componentWillUnmount() {
    this.state.screens.forEach(screen => {
      console.info(`...Shutting down ${screen.componentId}...`);
      screen.af_onShutdown();
      console.info(`Shut down ${screen.componentId}.`);
    });
  }

  public render() {
    return (
      <div className={"af-js-root"}>
        {this.state.currentPerspective && (
          <PerspectiveContainer
            root={{ ss: this.state.screens, ps: this.state.perspectives }}
            perspective={this.state.currentPerspective!}
            screens={this.state.openScreens}
            bridge={this.props.bridge}
            onCloseScreen={screen => this.setState(actions.closeScreen(screen))}
          />
        )}
      </div>
    );
  }
}
