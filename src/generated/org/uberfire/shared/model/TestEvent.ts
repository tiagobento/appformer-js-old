import { Portable } from "appformer/remote";
import { Foo } from "./Foo";

// Generated class
export class TestEvent implements Portable {
  private readonly _fqcn = "org.uberfire.shared.TestEvent";

  public bar?: string;
  public foo?: Foo;
  public child?: TestEvent;

  constructor(self: { bar: string; foo: Foo; child?: TestEvent }) {
    Object.assign(this, self);
  }
}
