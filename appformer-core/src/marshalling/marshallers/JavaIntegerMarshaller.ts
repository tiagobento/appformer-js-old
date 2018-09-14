import { MarshallingContext } from "marshalling/MarshallingContext";
import {JavaInteger} from "java-wrappers/JavaInteger";
import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";

export class JavaIntegerMarshaller extends NullableMarshaller<JavaInteger, number> {
  public notNullMarshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }
}
