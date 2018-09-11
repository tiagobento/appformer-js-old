import Portable from "appformer/internal/model/Portable";

export default abstract class JavaWrapper<T> implements Portable<JavaWrapper<T>> {
  private static readonly javaWrapperInstanceIdentifier = "fbeef485-6129-4c23-a047-166c6d2fb7a9";

  public abstract get(): T;

  private instanceIdentifier(): string {
    return JavaWrapper.javaWrapperInstanceIdentifier;
  }

  public static extendsJavaWrapper<T>(obj: any): obj is JavaWrapper<T> {
    if (!obj.instanceIdentifier) {
      return false;
    }

    return obj.instanceIdentifier() === JavaWrapper.javaWrapperInstanceIdentifier;
  }
}
