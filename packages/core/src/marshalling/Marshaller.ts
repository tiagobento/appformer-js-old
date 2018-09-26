import { MarshallingContext } from "./MarshallingContext";
import { Portable } from "../internal/model/Portable";
import { UnmarshallingContext } from "./UnmarshallingContext";

// marshall(T) => U
// unmarshall(V) => X

// TODO: check if there's a way to keep this signature using only two generic types (refactor to make marshall receive always unwrapped types when the type is able to be auto wrapped)
export interface Marshaller<T extends Portable<T>, U, V, X> {
  marshall(input: T, ctx: MarshallingContext): U | null;
  unmarshall(input: V | null, ctx: UnmarshallingContext): X | null;
}
