import { JavaLong } from "../../java-wrappers/JavaLong";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";

export class JavaLongMarshaller extends NullableMarshaller<JavaLong, ErraiObject, ErraiObject, JavaLong> {
  public notNullMarshall(input: JavaLong, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: `${input.get().toString(10)}`
    };
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaLong {
    return new JavaLong(input[ErraiObjectConstants.NUM_VAL] as string);
  }
}
