import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

export default abstract class JavaNumber extends JavaWrapper<number> {
  private readonly _value: number;

  public constructor(value: string) {
    super();
    const valueAsNumber = this.from(value);

    if (!this.isInRange(valueAsNumber)) {
      this._value = Number.NaN;
    } else {
      this._value = valueAsNumber;
    }
  }

  public get(): number {
    return this._value;
  }

  protected abstract from(asString: string): number;

  protected abstract isInRange(n: number): boolean;
}
