import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { BusinessMonitoringCommunityHomePageProvider } from "./BusinessMonitoringCommunityHomePageProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new BusinessMonitoringCommunityHomePageProvider()));
