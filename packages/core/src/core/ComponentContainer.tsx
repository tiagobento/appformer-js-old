import * as React from "react";

interface Props {
  af_componentId: string;
}

export class ComponentContainer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    //FIXME: Probably give an UUID instead of new Date().getTime()
    return <div af-js-component={this.props.af_componentId} id={new Date().getTime() + ""} />;
  }
}
