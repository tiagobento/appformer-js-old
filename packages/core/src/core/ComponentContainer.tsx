import * as React from "react";

interface Props {
  af_componentId: string;
}

export class ComponentContainer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return <div af-js-component={this.props.af_componentId}/>;
  }
}
