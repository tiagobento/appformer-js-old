import { JavaLong } from "java-wrappers/JavaLong";
import { ErraiObject } from "marshalling/model/ErraiObject";
import { MarshallingContext } from "marshalling/MarshallingContext";
import { ErraiObjectConstants } from "marshalling/model/ErraiObjectConstants";
import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";

export class JavaLongMarshaller extends NullableMarshaller<JavaLong, ErraiObject> {
  public notNullMarshall(input: JavaLong, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: `${input.get().toString(10)}`
    };
  }
}
