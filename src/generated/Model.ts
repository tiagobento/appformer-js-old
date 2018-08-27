export class Portable<T extends Portable<T>> {}

// Generated class
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
export class Foo implements Portable<Foo> {
  public foo?: string;

  constructor(self: { foo: string }) {
    Object.assign(this, self);
  }
}
