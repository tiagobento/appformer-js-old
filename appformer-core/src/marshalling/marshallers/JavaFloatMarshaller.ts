import {NullableMarshaller} from "./NullableMarshaller";
import {JavaFloat} from "../../java-wrappers";
import {MarshallingContext} from "../MarshallingContext";

export class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }
}
