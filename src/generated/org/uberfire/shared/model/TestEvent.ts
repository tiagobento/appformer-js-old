import { Portable } from "appformer/remote";
import { Foo } from "./Foo";

// Generated class
export class TestEvent extends Portable<TestEvent> {
  public bar?: string;
  public foo?: Foo;
  public child?: TestEvent;

  constructor(self: { bar: string; foo: Foo; child?: TestEvent }) {
    super(self, "org.uberfire.shared.TestEvent");
  }
}
