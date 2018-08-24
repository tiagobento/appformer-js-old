export enum ErraiBusObjectParts {
  ENCODED_TYPE = "^EncodedType",
  OBJECT_ID = "^ObjectID"
}

export interface ErraiBusObject {
  [ErraiBusObjectParts.ENCODED_TYPE]: string;
  [ErraiBusObjectParts.OBJECT_ID]: string;

  __toJson(): string;
}
