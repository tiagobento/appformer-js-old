import MarshallingContext from "appformer/marshalling/MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaOptional from "appformer/java-wrappers/JavaOptional";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import GenericsTypeMarshallingUtils from "appformer/marshalling/marshallers/util/GenericsTypeMarshallingUtils";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

export default class JavaOptionalMarshaller<T> extends NullableMarshaller<JavaOptional<T>, ErraiObject> {
  public notNullMarshall(input: JavaOptional<T>, ctx: MarshallingContext): ErraiObject {
    const innerValue = this.retrieveOptionalInnerValue(input.get(), ctx);

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: innerValue
    };
  }

  private retrieveOptionalInnerValue(input: T | undefined, ctx: MarshallingContext) {
    if (input === undefined) {
      return null;
    }

    return GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input, ctx);
  }
}
