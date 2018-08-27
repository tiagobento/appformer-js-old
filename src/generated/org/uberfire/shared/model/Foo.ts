// Generated class

import { Portable } from "appformer/remote";

export class Foo implements Portable {
  private readonly _fqcn = class {
    public static readonly value: () => string = () => {
      return "org.uberfire.shared.Foo";
    };
  };

  public foo?: string;

  constructor(self: { foo: string }) {
    Object.assign(this, self);
  }
}
