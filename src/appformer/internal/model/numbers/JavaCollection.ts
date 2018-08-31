import { JavaWrapper } from "./JavaWrapper";

export default interface JavaCollection<T extends Iterable<any>> extends JavaWrapper<T> {
  // this is here for type purposes only
}
