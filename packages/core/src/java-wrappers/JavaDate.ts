import { JavaWrapper } from "./JavaWrapper";
import { instanceOfDate } from "../util/TypeUtils";
import { JavaType } from "./JavaType";

export class JavaDate extends JavaWrapper<Date> {
  private readonly _fqcn = JavaType.DATE;

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
