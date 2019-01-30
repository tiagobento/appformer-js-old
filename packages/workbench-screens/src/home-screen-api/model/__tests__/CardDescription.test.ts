import { CardDescriptionLinkElement, CardDescriptionTextElement } from "../CardDescription";

describe("CardDescriptionElement", () => {
  describe("isText", () => {
    test("with CardDescriptionTextElement instance, should return true", () => {
      const input = new CardDescriptionTextElement("foo");
      expect(input.isText()).toBeTruthy();
    });

    test("with CardDescriptionLinkElement instance, should return false", () => {
      const input = new CardDescriptionLinkElement("foo", "bar");
      expect(input.isText()).toBeFalsy();
    });
  });

  describe("isLink", () => {
    test("with CardDescriptionLinkElement instance, should return true", () => {
      const input = new CardDescriptionLinkElement("foo", "bar");
      expect(input.isLink()).toBeTruthy();
    });

    test("with CardDescriptionTextElement instance, should return false", () => {
      const input = new CardDescriptionTextElement("foo");
      expect(input.isLink()).toBeFalsy();
    });
  });
});
