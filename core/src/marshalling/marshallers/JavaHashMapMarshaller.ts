import {NullableMarshaller} from "./NullableMarshaller";
import {ErraiObjectConstants} from "../model/ErraiObjectConstants";
import {GenericsTypeMarshallingUtils} from "./util/GenericsTypeMarshallingUtils";
import {JavaHashMap} from "../../java-wrappers/JavaHashMap";
import {MarshallingContext} from "../MarshallingContext";
import {ErraiObject} from "../model/ErraiObject";
import {isString} from "../../util/TypeUtils";

export class JavaHashMapMarshaller<T, U> extends NullableMarshaller<
  JavaHashMap<T | null, U | null>,
  ErraiObject
> {
  public notNullMarshall(input: JavaHashMap<T, U>, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getCached(input);
    if (cachedObject) {
      return cachedObject;
    }

    const marshalledEntriesMap = this.marshallEntries(input.get().entries(), ctx);

    const result = {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: marshalledEntriesMap
    };

    ctx.cacheObject(input, result);

    return result;
  }

  private marshallEntries(entries: IterableIterator<[T, U]>, ctx: MarshallingContext) {
    return Array.from(entries)
      .map(([key, value]) => this.marshallEntry(key, value, ctx))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  private marshallEntry(key: T, value: U, ctx: MarshallingContext) {
    const marshalledKey = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(key, ctx);
    const marshalledValue = GenericsTypeMarshallingUtils.marshallGenericsTypeElement(value, ctx);

    if (marshalledKey === null) {
      return { [ErraiObjectConstants.NULL]: marshalledValue };
    }

    if (!isString(marshalledKey)) {
      // need to prefix the key in order to tell errai-marshalling that the key is not a native string
      return { [ErraiObjectConstants.JSON + JSON.stringify(marshalledKey)]: marshalledValue };
    }

    return { [`${marshalledKey}`]: marshalledValue };
  }
}
