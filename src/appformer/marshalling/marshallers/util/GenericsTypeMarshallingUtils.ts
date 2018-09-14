import NumberWrapper from "appformer/java-wrappers/NumberWrapper";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import Portable from "appformer/internal/model/Portable";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import JavaWrapperUtils from "appformer/java-wrappers/JavaWrapperUtils";

export default class GenericsTypeMarshallingUtils {
  private static shouldWrapWhenUsedAsGenericsType(value: Portable<any>) {
    return value instanceof NumberWrapper || value instanceof JavaBoolean;
  }

  private static wrapGenericsTypeElement(value: Portable<any>, marshalledValue: any): ErraiObject {
    // This is mandatory in order to comply with errai-marshalling protocol.
    // When marshalling numeric or boolean values, we use its raw value, without any ErraiObject envelope.
    // But, when the value is a generic type, we always wrap it inside an ErraiObject

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (value as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: marshalledValue
    };
  }

  public static marshallGenericsTypeElement(value: any, ctx: MarshallingContext): ErraiObject {
    // apply automatic native types -> java types conversion
    const enhancedInput = JavaWrapperUtils.wrapIfNeeded(value);

    const marshaller = MarshallerProvider.getFor(enhancedInput);
    const marshalledValue = marshaller.marshall(enhancedInput, ctx);

    if (this.shouldWrapWhenUsedAsGenericsType(enhancedInput)) {
      return this.wrapGenericsTypeElement(enhancedInput, marshalledValue)!;
    }

    return marshalledValue;
  }
}
