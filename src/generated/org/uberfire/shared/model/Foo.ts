// Generated class
import Portable from "appformer/internal/model/Portable";

export default class Foo implements Portable {
  protected readonly _fqcn = "org.uberfire.shared.Foo";

  public foo?: string;

  constructor(self: { foo: string }) {
    Object.assign(this, self);
  }
}
