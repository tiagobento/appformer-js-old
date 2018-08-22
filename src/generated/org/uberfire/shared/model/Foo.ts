// Generated class

import { Portable } from "appformer/remote";

export class Foo extends Portable<Foo> {
  public foo?: string;

  constructor(self: { foo: string }) {
    super(self, "org.uberfire.shared.Foo");
  }
}
