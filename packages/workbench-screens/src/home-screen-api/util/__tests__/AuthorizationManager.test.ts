import { AuthorizationManager } from "../AuthorizationManager";

describe("hasAccessToPerspective", () => {
  beforeEach(() => {
    (window as any).AppFormer = {};
  });

  test("with HomeModelAuthorizationManager returning true, should return true", () => {
    (window as any).AppFormer.HomeModelAuthorizationManager = {
      authorize: (id: string) => true
    };

    expect(AuthorizationManager.hasAccessToPerspective("foo")).toBeTruthy();
  });

  test("with HomeModelAuthorizationManager returning false, should return false", () => {
    (window as any).AppFormer.HomeModelAuthorizationManager = {
      authorize: (id: string) => false
    };

    expect(AuthorizationManager.hasAccessToPerspective("foo")).toBeFalsy();
  });
});
