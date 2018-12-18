import { Portable } from "../marshalling";

export abstract class JavaEnum<T extends JavaEnum<T>> implements Portable<T> {
  public readonly name: string;

  protected constructor(name: string) {
    this.name = name;
  }
}
