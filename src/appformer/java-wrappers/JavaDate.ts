import JavaWrapper from "./JavaWrapper";

export default class JavaDate implements JavaWrapper<Date> {
  private readonly _fqcn = "java.util.Date";

  private readonly _value: Date;

  constructor(date: Date) {
    this._value = new Date(date);
  }

  public get(): Date {
    return this._value;
  }
}
