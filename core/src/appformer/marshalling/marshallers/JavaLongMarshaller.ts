import JavaLong from "appformer/java-wrappers/JavaLong";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaLongMarshaller extends NullableMarshaller<JavaLong, ErraiObject> {
  public notNullMarshall(input: JavaLong, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: `${input.get().toString(10)}`
    };
  }
}
