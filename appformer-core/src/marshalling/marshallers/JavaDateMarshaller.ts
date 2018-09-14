import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaDate } from "java-wrappers/JavaDate";
import { ErraiObject } from "marshalling/model/ErraiObject";
import { ErraiObjectConstants } from "marshalling/model/ErraiObjectConstants";
import { MarshallingContext } from "marshalling/MarshallingContext";

export  class JavaDateMarshaller extends NullableMarshaller<JavaDate, ErraiObject> {
  public notNullMarshall(input: JavaDate, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().getTime()}`
    };
  }
}
