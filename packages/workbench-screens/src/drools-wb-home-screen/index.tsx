import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { DroolsWbHomeScreenProvider } from "./DroolsWbHomeScreenProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new DroolsWbHomeScreenProvider()));
