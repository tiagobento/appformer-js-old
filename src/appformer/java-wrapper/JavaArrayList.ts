import JavaCollection from "appformer/java-wrapper/JavaCollection";

export default class JavaArrayList implements JavaCollection<any[]> {
  private readonly _fqcn = "java.util.ArrayList";

  private readonly _value: any[];

  constructor(value: any[]) {
    this._value = value;
  }

  public get(): any[] {
    return this._value;
  }
}
