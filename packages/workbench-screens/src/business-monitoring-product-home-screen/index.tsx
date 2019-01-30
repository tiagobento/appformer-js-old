import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { BusinessMonitoringProductHomePageProvider } from "./BusinessMonitoringProductHomePageProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new BusinessMonitoringProductHomePageProvider()));
