import Marshaller from "./Marshaller";
import { JavaShort } from "../internal/model/numbers/JavaShort";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaShortMarshaller implements Marshaller<JavaShort, number> {
  public marshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
