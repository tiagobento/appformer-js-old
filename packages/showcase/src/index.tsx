import * as React from "react";
import * as AppFormer from "appformer-js";
import { ComponentContainer, RootContext, RootContextValue } from "appformer-js";
import * as ShowcaseComponents from "appformer-js-showcase-components";
import * as DevConsole from "appformer-js-dev-console";

class MyApp extends AppFormer.Component {
  private myFramework: MyFramework;

  constructor() {
    super();
    this.isReact = true;
    this.hasContext = true;
    this.af_componentId = "my-app";
  }

  public goTo(af_perspectiveId: string) {
    this.myFramework.setState({ perspective: af_perspectiveId });
  }

  public af_componentRoot(portals?: any): AppFormer.Element {
    return <MyFramework exposing={ref => (this.myFramework = ref())} portals={portals} />;
  }
}

interface Props {
  exposing: (ref: () => MyFramework) => void;
  portals: any;
}

interface State {
  perspective?: string;
}

const MyAppContext = React.createContext<State>({ perspective: "asd" });

class MyFramework extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.exposing(() => this);
    this.state = { perspective: undefined };
  }

  public render() {
    return (
      <div className={"myapp-root"}>
        <MyAppContext.Provider value={this.state}>
          <ComponentContainer key={this.state.perspective!} af_componentId={this.state.perspective!} />
          {this.props.portals}
        </MyAppContext.Provider>
      </div>
    );
  }
}

export class ConsoleHeader extends AppFormer.Screen {
  constructor() {
    super();
    this.isReact = true;
    this.af_componentId = "console-header";
    this.af_componentTitle = undefined;
  }

  public af_componentRoot(): AppFormer.Element {
    return (
      <div
        style={{
          height: "50px",
          backgroundColor: "#333",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          padding: "0 10px 0 10px"
        }}
      >
        <RootContext.Consumer>
          {rootContext =>
            Array.from(Object.keys(rootContext.components)).map(af_componentId => (
              <button onClick={() => (window as any).goTo(af_componentId)} key={af_componentId}>
                {af_componentId}
              </button>
            ))
          }
        </RootContext.Consumer>
        <MyAppContext.Consumer>
          {myAppContext => (
            <h1 style={{ float: "right" }} color={"red"}>
              {myAppContext.perspective}
            </h1>
          )}
        </MyAppContext.Consumer>
      </div>
    );
  }
}

const myApp = new MyApp();
const app = AppFormer.init(myApp, document.body.children[0] as HTMLElement);
myApp.goTo("showcase-perspective");
app.register(new ShowcaseComponents.SillyReactScreen(), "screen");
app.register(new ShowcaseComponents.StringElementScreen(), "screen");
app.register(new ShowcaseComponents.PureDomElementScreen(), "screen");
app.register(new ShowcaseComponents.ReactComponentScreen(), "screen");
app.register(new DevConsole.ShowcasePerspective(), "perspective");
app.register(new DevConsole.NonReactShowcasePerspective(), "perspective");
app.register(new DevConsole.ConsolePerspective(), "perspective");
setTimeout(() => app.register(new ConsoleHeader(), "perspective"), 2000);

(window as any).goTo = (af_componentId: string) => {
  myApp.goTo(af_componentId);
};
