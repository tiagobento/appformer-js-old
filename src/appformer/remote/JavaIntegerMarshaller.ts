import { JavaInteger } from "../internal/model/numbers/JavaInteger";
import Marshaller from "./Marshaller";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaIntegerMarshaller implements Marshaller<JavaInteger, number> {
  public marshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }
}
