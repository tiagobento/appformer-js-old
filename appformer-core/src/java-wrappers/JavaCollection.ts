import { JavaWrapper } from "java-wrappers/JavaWrapper";

export abstract class JavaCollection<T extends Iterable<any> | null> extends JavaWrapper<T> {
  // this is here for type purposes only
}
