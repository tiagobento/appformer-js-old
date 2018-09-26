import { JavaString } from "../../java-wrappers/JavaString";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfString } from "../../util/TypeUtils";

export class JavaStringMarshaller extends NullableMarshaller<JavaString, string, string | JavaString, string> {
  public notNullMarshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }

  public notNullUnmarshall(input: string | JavaString, ctx: UnmarshallingContext): string {
    if (instanceOfString(input)) {
      return input;
    }

    return input.get();
  }
}
