import { Service } from "./Components";
import { Component } from "./Component";

export abstract class Screen extends Component {
  public af_componentTitle?: string = undefined;
  public af_componentService: Service = {};

  protected constructor(componentId: string) {
    super({ type: "screen", af_componentId: componentId });
  }
}
