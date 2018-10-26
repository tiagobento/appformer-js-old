export class DisplayInfo {
  private _contextId?: string = undefined;
  private _contextDisplayMode: ContextDisplayMode = ContextDisplayMode.SHOW;

  get contextId(): string | undefined {
    return this._contextId;
  }

  set contextId(value: string | undefined) {
    this._contextId = value;
  }

  get contextDisplayMode(): ContextDisplayMode {
    return this._contextDisplayMode;
  }

  set contextDisplayMode(value: ContextDisplayMode) {
    this._contextDisplayMode = value;
  }
}

export enum ContextDisplayMode {
  SHOW = "SHOW",
  HIDE = "HIDE"
}
