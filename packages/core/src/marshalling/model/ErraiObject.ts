import { ErraiObjectConstants } from "./ErraiObjectConstants";

export interface ErraiObject {
  [ErraiObjectConstants.ENCODED_TYPE]: string;
  [ErraiObjectConstants.OBJECT_ID]?: string;
  [ErraiObjectConstants.NUM_VAL]?: string | number | boolean;
  [ErraiObjectConstants.VALUE]?: any;
  [ErraiObjectConstants.ENUM_STRING_VALUE]?: string;
}
