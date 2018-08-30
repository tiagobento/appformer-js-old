import Marshaller from "./Marshaller";
import { JavaBoolean } from "../internal/model/numbers/JavaBoolean";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaBooleanMarshaller implements Marshaller<JavaBoolean, boolean> {
  public marshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }
}
