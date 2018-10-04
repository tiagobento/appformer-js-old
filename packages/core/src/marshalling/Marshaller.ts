import { MarshallingContext } from "./MarshallingContext";
import { Portable } from "../internal/model/Portable";
import { UnmarshallingContext } from "./UnmarshallingContext";

// marshall(T) => U
// unmarshall(V) => X

export interface Marshaller<T extends Portable<T>, U, V, X> {
  marshall(input: T, ctx: MarshallingContext): U | null;
  unmarshall(input: V | undefined, ctx: UnmarshallingContext): X | undefined;
}
