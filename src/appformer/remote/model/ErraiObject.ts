export enum ErraiObjectConstants {
  ENCODED_TYPE = "^EncodedType",
  OBJECT_ID = "^ObjectID",
  NUM_VAL = "^NumVal",
  VALUE = "^Value",
  JSON = "^${$JSON$}$::"
}

export interface ErraiObject {
  [ErraiObjectConstants.ENCODED_TYPE]?: string;
  [ErraiObjectConstants.OBJECT_ID]?: string;
  [ErraiObjectConstants.NUM_VAL]?: string | number;
  [ErraiObjectConstants.VALUE]?: any;
}
