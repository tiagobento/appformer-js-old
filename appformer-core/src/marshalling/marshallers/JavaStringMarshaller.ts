import { JavaString } from "../../java-wrappers/JavaString";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "../marshallers/NullableMarshaller";

export class JavaStringMarshaller extends NullableMarshaller<JavaString, string> {
  public notNullMarshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
