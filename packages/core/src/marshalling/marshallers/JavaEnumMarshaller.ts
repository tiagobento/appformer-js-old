import { NullableMarshaller } from "./NullableMarshaller";
import { JavaEnum } from "../../java-wrappers";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { EnumStringValueBasedErraiObject } from "../model/EnumStringValueBasedErraiObject";

export class JavaEnumMarshaller<T extends JavaEnum<T>> extends NullableMarshaller<
  JavaEnum<T>,
  ErraiObject,
  ErraiObject,
  JavaEnum<T>
> {
  public notNullMarshall(input: JavaEnum<T>, ctx: MarshallingContext): ErraiObject {
    return new EnumStringValueBasedErraiObject((input as any)._fqcn, input.name).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaEnum<T> {
    const valueObject = EnumStringValueBasedErraiObject.from(input);
    const factory = ctx.getFactory(valueObject.encodedType);

    // the factory method for enums receives the enum name and returns the appropriate enum value
    return (factory as any)(valueObject.enumValueName);
  }
}
