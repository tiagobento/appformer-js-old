import { Service } from "./Components";
import { Component } from "./Component";

export abstract class Screen extends Component {
  public af_componentTitle?: string = undefined;
  public af_componentService: Service = {};
  public af_subscriptions: Map<string, ((event: any) => void)> = new Map();

  protected constructor(componentId: string) {
    super({ type: "screen", af_componentId: componentId });
  }

  public af_onStartup(): void {
    //
  }

  public af_onOpen(): void {
    //
  }

  public af_onFocus(): void {
    //
  }

  public af_onLostFocus(): void {
    //
  }

  public af_onMayClose(): boolean {
    return true;
  }

  public af_onClose(): void {
    //
  }

  public af_onShutdown(): void {
    //
  }
}
