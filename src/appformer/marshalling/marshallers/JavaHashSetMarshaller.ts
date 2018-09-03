import JavaCollectionMarshaller from "appformer/marshalling/marshallers/JavaCollectionMarshaller";
import Portable from "appformer/internal/model/Portable";

export default class JavaHashSetMarshaller extends JavaCollectionMarshaller<Set<Portable<any>>> {}
