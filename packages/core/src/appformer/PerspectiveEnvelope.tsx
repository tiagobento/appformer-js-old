import * as React from "react";
import { Element, Component } from "../core";
import { Perspective } from "./Perspective";
import { ComponentTypes } from "./ComponentTypes";

export class PerspectiveEnvelope extends Component {
  public readonly perspective: Perspective;

  constructor(perspective: Perspective) {
    super({ type: ComponentTypes.PERSPECTIVE_ENVELOPE, core_componentId: perspective.af_componentId });
    this.af_isReact = true;
    this.perspective = perspective;
  }

  public core_componentRoot(): Element {
    return <PerspectiveEnvelopeReactComponent perspective={this.perspective} />;
  }
}

class PerspectiveEnvelopeReactComponent extends React.Component<{ perspective: Perspective }, {}> {
  public render() {
    return <div af-js-component={this.props.perspective.af_componentId + "-contents"} />;
  }
}
