import { JavaWrapper } from "java-wrappers/JavaWrapper";

export class JavaDate extends JavaWrapper<Date> {
  private readonly _fqcn = "java.util.Date";

  private readonly _value: Date;

  constructor(date: Date) {
    super();
    this._value = new Date(date);
  }

  public get(): Date {
    return this._value;
  }
}
