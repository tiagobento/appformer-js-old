import { JavaShort } from "java-wrappers/JavaShort";
import { MarshallingContext } from "marshalling/MarshallingContext";
import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";

export class JavaShortMarshaller extends NullableMarshaller<JavaShort, number> {
  public notNullMarshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
