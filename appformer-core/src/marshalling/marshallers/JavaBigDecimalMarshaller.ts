import {NullableMarshaller} from "./NullableMarshaller";
import {JavaBigDecimal} from "../../java-wrappers";
import {ErraiObjectConstants} from "../model/ErraiObjectConstants";
import {ErraiObject} from "../model/ErraiObject";
import {MarshallingContext} from "../MarshallingContext";

export class JavaBigDecimalMarshaller extends NullableMarshaller<JavaBigDecimal, ErraiObject> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
