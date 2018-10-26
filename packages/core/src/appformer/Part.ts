import { DisplayInfo } from "./DisplayInfo";

export class Part {
  private _placeName: string;
  private _displayInfo: DisplayInfo = new DisplayInfo();
  private _parameters: {} = {};

  constructor(placeName: string) {
    this._placeName = placeName;
  }

  get placeName(): string {
    return this._placeName;
  }

  set placeName(value: string) {
    this._placeName = value;
  }

  get displayInfo(): DisplayInfo {
    return this._displayInfo;
  }

  set displayInfo(value: DisplayInfo) {
    this._displayInfo = value;
  }

  get parameters(): {} {
    return this._parameters;
  }

  set parameters(value: {}) {
    this._parameters = value;
  }
}
