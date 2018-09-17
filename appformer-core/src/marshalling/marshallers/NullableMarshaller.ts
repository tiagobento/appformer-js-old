import {MarshallingContext} from "../MarshallingContext";
import {Marshaller} from "../Marshaller";
import {Portable} from "../../internal/model/Portable";

export  abstract class NullableMarshaller<T extends Portable<T>, U> implements Marshaller<T, U> {
  public marshall(input: T, ctx: MarshallingContext): U | null {
    if (input === null || input === undefined) {
      return null;
    }

    return this.notNullMarshall(input, ctx);
  }

  public abstract notNullMarshall(input: T, ctx: MarshallingContext): U;
}
