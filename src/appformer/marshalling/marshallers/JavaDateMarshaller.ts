import MarshallingContext from "../MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaDate from "appformer/java-wrappers/JavaDate";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

export default class JavaDateMarshaller extends NullableMarshaller<JavaDate, ErraiObject> {
  public notNullMarshall(input: JavaDate, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().getTime()}`
    };
  }
}
