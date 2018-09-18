import * as React from "react";

interface Props {
  showEvents: () => void;
  showRPC: () => void;
  status: { eventsConsole: boolean; rpcConsole: boolean };
}

export class ConsoleDock extends React.Component<Props, {}> {
  public render() {
    return (
      <div
        style={{
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#1f1f1f",
          color: "#fcfcfc",
          textAlign: "center",
          display: "flex",
          alignContent: "space-around",
          alignItems: "center",
          flexFlow: "row wrap",
          listStyle: "none",
          flexDirection: "column",
          padding: "10px 0 0 0"
        }}
      >
        <span
          onClick={() => this.props.showRPC()}
          style={{
            opacity: this.props.status.rpcConsole ? 0.4 : 1
          }}
        >
          <DockButton title={"RPC Calls"} />
        </span>

        <span
          onClick={() => this.props.showEvents()}
          style={{
            opacity: this.props.status.eventsConsole ? 0.4 : 1
          }}
        >
          <DockButton title={"Events"} />
        </span>
      </div>
    );
  }
}

export class DockButton extends React.Component<{ title: string }, {}> {
  public rot: HTMLElement;
  public cont: HTMLElement;

  public componentDidMount(): void {
    this.cont.style.height = parseInt(getComputedStyle(this.rot).width!, 10) + 6 + "px";
    this.cont.style.width = parseInt(getComputedStyle(this.rot).height!, 10) + 4 + "px";
  }

  public render() {
    return (
      <div ref={e => (this.cont = e!)}>
        <button
          ref={e => (this.rot = e!)}
          style={{
            top: "-26px",
            position: "relative",
            transform: "rotate(90deg)",
            transformOrigin: "left bottom",
            whiteSpace: "nowrap"
          }}
        >
          {this.props.title}
        </button>
      </div>
    );
  }
}
