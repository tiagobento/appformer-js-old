import Marshaller from "appformer/marshalling/Marshaller";
import JavaCollection from "appformer/java-wrapper/JavaCollection";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaNumber from "appformer/java-wrapper/JavaNumber";
import Portable from "appformer/internal/model/Portable";

export default class JavaCollectionMarshaller<T extends Iterable<Portable<any>>>
  implements Marshaller<JavaCollection<T>, ErraiObject> {
  public marshall(input: JavaCollection<T>, ctx: MarshallingContext): ErraiObject {
    const elements = input.get();

    const serializedValues = [];
    for (const element of Array.from(elements)) {
      serializedValues.push(this.marshallInnerElement(element, ctx));
    }

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: serializedValues
    };
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

    return marshaller.marshall(value, ctx);
  }

  private erraiObjectFromNumber(value: any, marshaledValue: any) {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (value as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: marshaledValue
    };
  }
}
