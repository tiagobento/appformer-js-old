import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default interface Marshaller<T, U> {
  marshall(input: T, ctx: MarshallingContext): U;
}
