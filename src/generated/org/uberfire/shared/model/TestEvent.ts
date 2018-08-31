import Portable from "appformer/internal/model/Portable";
import Foo from "generated/org/uberfire/shared/model/Foo";

// Generated class
export default class TestEvent implements Portable {
  protected readonly _fqcn = "org.uberfire.shared.TestEvent";

  public bar?: string;
  public foo?: Foo;
  public child?: TestEvent;

  constructor(self: { bar: string; foo: Foo; child?: TestEvent }) {
    Object.assign(this, self);
  }
}
