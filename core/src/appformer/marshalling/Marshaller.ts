import MarshallingContext from "appformer/marshalling/MarshallingContext";
import Portable from "appformer/internal/model/Portable";

export default interface Marshaller<T extends Portable<T>, U> {
  marshall(input: T, ctx: MarshallingContext): U | null;
}
