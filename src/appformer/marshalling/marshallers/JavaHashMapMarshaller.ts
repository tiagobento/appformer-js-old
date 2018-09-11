import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import GenericsTypeMarshallingUtils from "appformer/marshalling/marshallers/util/GenericsTypeMarshallingUtils";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import { isString } from "appformer/util/TypeUtils";

export default class JavaHashMapMarshaller<T, U> extends NullableMarshaller<JavaHashMap<T, U>, ErraiObject> {
  public notNullMarshall(input: JavaHashMap<T, U>, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject) {
      return cachedObject;
    }

    const marshalledEntriesMap = this.marshallEntries(input.get().entries(), ctx);

    const result = {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: marshalledEntriesMap
    };

    ctx.recordObject(input, result);

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

    if (!isString(marshalledKey)) {
      // need to prefix the key in order to tell errai-marshalling that the key is not a native string
      return { [ErraiObjectConstants.JSON + JSON.stringify(marshalledKey)]: marshalledValue };
    }

    return { [`${marshalledKey}`]: marshalledValue };
  }
}
