import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { MarshallingContext } from "./ErraiMarshaller";
import { JavaArrayList } from "../internal/model/numbers/JavaArrayList";

export default class JavaArrayListMarshaller implements Marshaller<JavaArrayList, ErraiObject> {
  public marshall(input: JavaArrayList, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
