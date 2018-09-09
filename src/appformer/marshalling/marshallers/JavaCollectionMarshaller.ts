import Marshaller from "appformer/marshalling/Marshaller";
import JavaCollection from "appformer/java-wrappers/JavaCollection";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import JavaNumber from "appformer/java-wrappers/JavaNumber";
import Portable from "appformer/internal/model/Portable";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";

class JavaCollectionMarshaller<T extends Iterable<Portable<any>>>
  implements Marshaller<JavaCollection<T>, ErraiObject> {
  public marshall(input: JavaCollection<T>, ctx: MarshallingContext): ErraiObject {
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

  private marshallInnerElement(value: any, ctx: MarshallingContext): ErraiObject {
    const marshaller = MarshallerProvider.getFor(value);
    const marshaledValue = marshaller.marshall(value, ctx);

    if (value instanceof JavaNumber) {
      // This is mandatory in order to comply with errai-marshalling protocol.
      // When it founds a number inside a collection, the number is wrapped
      // inside a ErraiObject envelope
      return this.erraiObjectFromNumber(value, marshaledValue);
    }

    return marshaledValue;
  }

  private erraiObjectFromNumber(value: any, marshaledValue: any) {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (value as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: marshaledValue
    };
  }
}

export class JavaArrayListMarshaller extends JavaCollectionMarshaller<Array<Portable<any>>> {}

export class JavaHashSetMarshaller extends JavaCollectionMarshaller<Set<Portable<any>>> {}
