import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaDouble } from "java-wrappers/JavaDouble";
import { MarshallingContext } from "marshalling/MarshallingContext";

export  class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
