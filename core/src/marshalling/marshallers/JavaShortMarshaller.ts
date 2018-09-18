import { JavaShort } from "../../java-wrappers/JavaShort";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";

export class JavaShortMarshaller extends NullableMarshaller<JavaShort, number> {
  public notNullMarshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
