import { MarshallingContext } from "./MarshallingContext";
import { Portable } from "../internal";

export interface Marshaller<T extends Portable<T>, U> {
  marshall(input: T, ctx: MarshallingContext): U | null;
}
