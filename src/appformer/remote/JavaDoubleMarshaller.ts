import Marshaller from "./Marshaller";
import { JavaDouble } from "../internal/model/numbers/JavaDouble";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaDoubleMarshaller implements Marshaller<JavaDouble, number> {
  public marshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
