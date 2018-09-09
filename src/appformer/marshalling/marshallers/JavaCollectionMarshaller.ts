import JavaCollection from "appformer/java-wrappers/JavaCollection";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Portable from "appformer/internal/model/Portable";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import CollectionElementWrapper from "appformer/marshalling/marshallers/util/CollectionElementWrapper";

class JavaCollectionMarshaller<T extends Iterable<Portable<any>>> extends NullableMarshaller<
  JavaCollection<T>,
  ErraiObject
> {
  public notNullMarshall(input: JavaCollection<T>, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject) {
      return cachedObject;
    }

    const elements = input.get();

    const serializedValues = [];
    for (const element of Array.from(elements)) {
      serializedValues.push(this.marshallInnerElement(element, ctx));
    }

    const resultObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: serializedValues
    };

    ctx.recordObject(input, resultObject);

    return resultObject;
  }

  private marshallInnerElement(value: Portable<any>, ctx: MarshallingContext): ErraiObject {
    const marshaller = MarshallerProvider.getFor(value);
    const marshaledValue = marshaller.marshall(value, ctx);

    if (CollectionElementWrapper.shouldWrapWhenInsideCollection(value)) {
      return CollectionElementWrapper.erraiObjectFromCollectionInnerElement(value, marshaledValue)!;
    }

    return marshaledValue;
  }
}

export class JavaArrayListMarshaller extends JavaCollectionMarshaller<Array<Portable<any>>> {}

export class JavaHashSetMarshaller extends JavaCollectionMarshaller<Set<Portable<any>>> {}
