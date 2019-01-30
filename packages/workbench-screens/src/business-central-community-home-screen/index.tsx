import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { BusinessCentralCommunityHomePageProvider } from "./BusinessCentralCommunityHomePageProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new BusinessCentralCommunityHomePageProvider()));
