import { JavaWrapper } from "./JavaWrapper";
import { instanceOfDate } from "../util/TypeUtils";

export class JavaDate extends JavaWrapper<Date> {
  private readonly _fqcn = "java.util.Date";

  private _value: Date;

  constructor(date: Date) {
    super();
    this.set(date);
  }

  public get(): Date {
    return this._value;
  }

  public set(val: ((current: Date) => Date) | Date): void {
    if (instanceOfDate(val)) {
      this._value = val;
    } else {
      this._value = val(this.get());
    }
  }
}
