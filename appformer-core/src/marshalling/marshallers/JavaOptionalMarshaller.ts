import {MarshallingContext} from "../MarshallingContext";
import {NullableMarshaller} from "./NullableMarshaller";
import {JavaOptional} from "../../java-wrappers/JavaOptional";
import {ErraiObject} from "../model/ErraiObject";
import {GenericsTypeMarshallingUtils} from "./util/GenericsTypeMarshallingUtils";
import {ErraiObjectConstants} from "../model/ErraiObjectConstants";

export class JavaOptionalMarshaller<T> extends NullableMarshaller<JavaOptional<T>, ErraiObject> {
  public notNullMarshall(input: JavaOptional<T>, ctx: MarshallingContext): ErraiObject {
    const innerValue = this.retrieveOptionalInnerValue(input, ctx);

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: innerValue
    };
  }

  private retrieveOptionalInnerValue(input: JavaOptional<T>, ctx: MarshallingContext) {
    if (!input.isPresent()) {
      return null;
    }

    return GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input.get(), ctx);
  }
}
