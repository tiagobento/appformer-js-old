import { JavaCollection } from "java-wrappers/JavaCollection";
import { ErraiObject } from "marshalling/model/ErraiObject";
import { MarshallingContext } from "marshalling/MarshallingContext";
import { ErraiObjectConstants } from "marshalling/model/ErraiObjectConstants";
import { Portable } from "internal/model/Portable";
import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { GenericsTypeMarshallingUtils } from "marshalling/marshallers/util/GenericsTypeMarshallingUtils";

class JavaCollectionMarshaller<T extends Iterable<Portable<any> | null>> extends NullableMarshaller<
  JavaCollection<T>,
  ErraiObject
> {
  public notNullMarshall(input: JavaCollection<T>, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getCached(input);
    if (cachedObject) {
      return cachedObject;
    }

    const elements = input.get();

    const serializedValues = [];
    for (const element of Array.from(elements)) {
      serializedValues.push(GenericsTypeMarshallingUtils.marshallGenericsTypeElement(element, ctx));
    }

    const resultObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: serializedValues
    };

    ctx.cacheObject(input, resultObject);

    return resultObject;
  }
}

export class JavaArrayListMarshaller extends JavaCollectionMarshaller<Array<Portable<any> | null>> {}

export class JavaHashSetMarshaller extends JavaCollectionMarshaller<Set<Portable<any> | null>> {}
