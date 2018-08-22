import { Portable } from "generated/Model";

export function marshall(obj: Portable<any> | string) {
  return typeof obj !== "string" ? obj.__toErraiBusObject().__toJson() : obj;
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}
