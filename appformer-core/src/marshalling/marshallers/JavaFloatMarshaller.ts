import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaFloat } from "java-wrappers/JavaFloat";
import { MarshallingContext } from "marshalling/MarshallingContext";

export class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }
}
