import { Portable } from "appformer/remote";
import { Foo } from "./Foo";

// Generated class
export class TestEvent implements Portable {
  private readonly _fqcn = class {
    public static readonly value: () => string = () => {
      return "org.uberfire.shared.TestEvent";
    };
  };

  public readonly fqcn: string = this._fqcn.value();

  public bar?: string;
  public foo?: Foo;
  public child?: TestEvent;

  constructor(self: { bar: string; foo: Foo; child?: TestEvent }) {
    Object.assign(this, self);
  }
}
