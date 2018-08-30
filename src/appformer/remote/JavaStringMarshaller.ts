import Marshaller from "./Marshaller";
import { JavaString } from "../internal/model/numbers/JavaString";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaStringMarshaller implements Marshaller<JavaString, string> {
  public marshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
