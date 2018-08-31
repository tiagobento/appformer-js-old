import Portable from "appformer/internal/model/Portable";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import ErraiMarshaller from "appformer/marshalling/marshallers/ErraiMarshaller";

export function marshall(obj: Portable | string) {
  MarshallerProvider.initialize();
  const erraiMarshaller = new ErraiMarshaller({ marshallerProvider: new MarshallerProvider() });

  return JSON.stringify(erraiMarshaller.marshall(obj));
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}
