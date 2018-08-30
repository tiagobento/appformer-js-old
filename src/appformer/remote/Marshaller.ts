import { MarshallingContext } from "./MarshallingContext";

export default interface Marshaller<T, U> {
  marshall(input: T, ctx: MarshallingContext): U;
}
