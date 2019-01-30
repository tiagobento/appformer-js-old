import * as HomeApi from "../home-screen-api";
import { Profile } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import * as AppFormer from "appformer-js";

export class OptaplannerWbHomeScreenProvider implements HomeApi.HomeScreenProvider {
  public get(profile: Profile): HomeApi.HomeScreen {
    const welcomeText = AppFormer.translate("HomeProducer.Heading", []);

    const description = AppFormer.translate("HomeProducer.SubHeading", []);

    const backgroundImageUrl = "images/home_bg.jpg";

    const cards = [this.designCard(), this.devOpsCard()];

    return new HomeApi.HomeScreen(welcomeText, description, backgroundImageUrl, cards);
  }

  private designCard() {
    const cssClasses = ["pficon", "pficon-blueprint"];
    const title = AppFormer.translate("HomeProducer.Design", []);

    const descriptionTextMask = AppFormer.translate("HomeProducer.DesignDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "LibraryPerspective");
  }

  private devOpsCard() {
    const cssClasses = ["fa", "fa-gears"];
    const title = AppFormer.translate("HomeProducer.DevOps", []);

    const descriptionTextMask = AppFormer.translate("HomeProducer.DevOpsDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "ServerManagementPerspective");
  }
}
