import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";
import { JavaOptional } from "../../java-wrappers/JavaOptional";
import { ErraiObject } from "../model/ErraiObject";
import { GenericsTypeMarshallingUtils } from "./util/GenericsTypeMarshallingUtils";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ValueBasedErraiObject } from "../model/ValueBasedErraiObject";
import { MarshallerProvider } from "../MarshallerProvider";

export class JavaOptionalMarshaller<T> extends NullableMarshaller<
  JavaOptional<T | undefined>,
  ErraiObject,
  ErraiObject,
  JavaOptional<T | undefined>
> {
  public notNullMarshall(input: JavaOptional<T | undefined>, ctx: MarshallingContext): ErraiObject {
    const innerValue = this.retrieveOptionalInnerValue(input, ctx);
    return new ValueBasedErraiObject((input as any)._fqcn, innerValue).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaOptional<T | undefined> {
    const value = ValueBasedErraiObject.from(input).value;
    if (value === null || value === undefined) {
      return new JavaOptional(undefined);
    }

    const unmarshalledValue = MarshallerProvider.getForObject(value).unmarshall(value, ctx);

    return new JavaOptional(unmarshalledValue);
  }

  private retrieveOptionalInnerValue(input: JavaOptional<T | undefined>, ctx: MarshallingContext) {
    if (!input.isPresent()) {
      return null;
    }

    return GenericsTypeMarshallingUtils.marshallGenericsTypeElement(input.get(), ctx);
  }
}
