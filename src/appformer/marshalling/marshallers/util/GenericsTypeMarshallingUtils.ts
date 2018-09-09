import JavaNumber from "appformer/java-wrappers/JavaNumber";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import Portable from "appformer/internal/model/Portable";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";

export default class GenericsTypeMarshallingUtils {
  private static shouldWrapWhenUsedAsGenericsType(value: Portable<any>) {
    return value instanceof JavaNumber || value instanceof JavaBoolean;
  }

  private static wrapGenericsTypeElement(value: Portable<any>, marshaledValue: any): ErraiObject {
    // This is mandatory in order to comply with errai-marshalling protocol.
    // Primitive types must be wrapped inside an ErraiObject envelope when
    // used as Generics type.

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (value as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: marshaledValue
    };
  }

  public static marshallGenericsTypeElement(value: Portable<any>, ctx: MarshallingContext): ErraiObject {
    const marshaller = MarshallerProvider.getFor(value);
    const marshaledValue = marshaller.marshall(value, ctx);

    if (this.shouldWrapWhenUsedAsGenericsType(value)) {
      return this.wrapGenericsTypeElement(value, marshaledValue)!;
    }

    return marshaledValue;
  }
}
