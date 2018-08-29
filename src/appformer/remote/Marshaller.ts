import { MarshallingContext } from "./ErraiMarshaller";

export default interface Marshaller<T, U> {
  marshall(input: T, ctx: MarshallingContext): U;
}
