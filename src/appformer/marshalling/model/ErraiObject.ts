import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

export default interface ErraiObject {
  [ErraiObjectConstants.ENCODED_TYPE]?: string;
  [ErraiObjectConstants.OBJECT_ID]?: string;
  [ErraiObjectConstants.NUM_VAL]?: string | number;
  [ErraiObjectConstants.VALUE]?: any;
}
