import Marshaller from "./Marshaller";
import { ErraiObject, ErraiObjectConstants } from "./model/ErraiObject";
import { JavaArrayList } from "../internal/model/numbers/JavaArrayList";
import { MarshallingContext } from "./MarshallingContext";
import { ErraiMarshaller } from "./ErraiMarshaller";
import { MarshallerProvider } from "./MarshallerProvider";
import { JavaNumber } from "../internal/model/numbers/JavaNumber";

export default class JavaArrayListMarshaller implements Marshaller<JavaArrayList, ErraiObject> {
  public marshall(input: JavaArrayList, ctx: MarshallingContext): ErraiObject {
    const elements = input.get();

    const serializedValues = elements.map(value => this.marshallInnerElement(value, ctx));

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: serializedValues
    };
  }

  private marshallInnerElement(value: any, ctx: MarshallingContext): ErraiObject {
    // FIXME: not nice
    const provider = new MarshallerProvider();
    const marshaller = new ErraiMarshaller({ marshallerProvider: provider });

    if (value instanceof JavaNumber) {
      const fqcn = (value as any)._fqcn;
      const customMarshaller = MarshallerProvider.getFor(fqcn);
      const marshalledValue = customMarshaller.marshall(value, ctx);

      return {
        [ErraiObjectConstants.ENCODED_TYPE]: fqcn,
        [ErraiObjectConstants.OBJECT_ID]: "-1",
        [ErraiObjectConstants.NUM_VAL]: marshalledValue
      };
    }

    return marshaller.marshall(value, ctx);
  }
}
