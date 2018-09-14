import { MarshallingContext } from "marshalling/MarshallingContext";
import { Portable } from "internal/model/Portable";

export interface Marshaller<T extends Portable<T>, U> {
  marshall(input: T, ctx: MarshallingContext): U | null;
}
