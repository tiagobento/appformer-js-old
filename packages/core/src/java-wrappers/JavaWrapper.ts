import { Portable } from "../marshalling/Portable";

export abstract class JavaWrapper<T> implements Portable<JavaWrapper<T>> {
  private static readonly javaWrapperInstanceIdentifier = "fbeef485-6129-4c23-a047-166c6d2fb7a9";

  public abstract get(): T;

  public abstract set(val: T | ((current: T) => T)): void;

  private instanceIdentifier(): string {
    return JavaWrapper.javaWrapperInstanceIdentifier;
  }

  public static extendsJavaWrapper<T>(obj: any): obj is JavaWrapper<T> {
    if (!obj.instanceIdentifier) {
      return false;
    }

    // this is just a trick to allow the application to identify in runtime if an object extends JavaWrapper.
    return obj.instanceIdentifier() === JavaWrapper.javaWrapperInstanceIdentifier;
  }
}
