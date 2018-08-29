import { JavaInteger } from "../internal/model/numbers/JavaInteger";
import Marshaller from "./Marshaller";
import { MarshallingContext } from "./ErraiMarshaller";

export default class JavaIntegerMarshaller implements Marshaller<JavaInteger, number> {
  public marshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }
}
