import {JavaString} from "../../java-wrappers/JavaString";
import {MarshallingContext} from "../MarshallingContext";
import {NullableMarshaller} from "./NullableMarshaller";

export class JavaStringMarshaller extends NullableMarshaller<JavaString, string> {
  public notNullMarshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
