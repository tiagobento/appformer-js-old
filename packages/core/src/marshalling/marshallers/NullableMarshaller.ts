import { MarshallingContext } from "../MarshallingContext";
import { Marshaller } from "../Marshaller";
import { Portable } from "../../internal/model/Portable";
import { UnmarshallingContext } from "../UnmarshallingContext";

export abstract class NullableMarshaller<T extends Portable<T>, U, V, X> implements Marshaller<T, U, V, X> {
  public marshall(input: T, ctx: MarshallingContext): U | null {
    if (input === null || input === undefined) {
      return null;
    }

    return this.notNullMarshall(input, ctx);
  }

  public unmarshall(input: V | null, ctx: UnmarshallingContext): X | null {
    if (input === null || input === undefined) {
      return null;
    }

    return this.notNullUnmarshall(input, ctx);
  }

  public abstract notNullMarshall(input: T, ctx: MarshallingContext): U;

  public abstract notNullUnmarshall(input: V, ctx: UnmarshallingContext): X;
}
