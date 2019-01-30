import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { BusinessCentralProductHomePageProvider } from "./BusinessCentralProductHomePageProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new BusinessCentralProductHomePageProvider()));
