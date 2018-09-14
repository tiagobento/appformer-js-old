import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

export default abstract class JavaCollection<T extends Iterable<any> | null> extends JavaWrapper<T> {
  // this is here for type purposes only
}
