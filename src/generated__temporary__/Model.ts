// Generated class
import Portable from "appformer/internal/model/Portable";

export class TestEvent implements Portable<TestEvent> {
  protected readonly _fqcn = "asdf";

  public bar?: string;
  public foo?: Foo;
  public child?: TestEvent;

  constructor(self: { bar: string; foo: Foo; child?: TestEvent }) {
    Object.assign(this, self);
  }
}

// Generated class
export class Foo implements Portable<TestEvent> {
  protected readonly _fqcn = "bdfds";

  public foo?: string;

  constructor(self: { foo: string }) {
    Object.assign(this, self);
  }
}
