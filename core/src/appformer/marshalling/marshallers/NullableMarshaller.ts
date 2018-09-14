import MarshallingContext from "appformer/marshalling/MarshallingContext";
import Marshaller from "appformer/marshalling/Marshaller";
import Portable from "appformer/internal/model/Portable";

export default abstract class NullableMarshaller<T extends Portable<T>, U> implements Marshaller<T, U> {
  public marshall(input: T, ctx: MarshallingContext): U | null {
    if (input === null || input === undefined) {
      return null;
    }

    return this.notNullMarshall(input, ctx);
  }

  public abstract notNullMarshall(input: T, ctx: MarshallingContext): U;
}
