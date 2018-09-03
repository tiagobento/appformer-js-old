import JavaWrapper from "appformer/java-wrapper/JavaWrapper";

export default abstract class JavaNumber implements JavaWrapper<number> {
  private readonly _value: number;

  public constructor(value: string) {
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
