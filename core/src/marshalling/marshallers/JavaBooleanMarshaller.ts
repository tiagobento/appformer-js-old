import {NullableMarshaller} from "./NullableMarshaller";
import {JavaBoolean} from "../../java-wrappers/JavaBoolean";
import {MarshallingContext} from "../MarshallingContext";

export class JavaBooleanMarshaller extends NullableMarshaller<JavaBoolean, boolean> {
  public notNullMarshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }
}
