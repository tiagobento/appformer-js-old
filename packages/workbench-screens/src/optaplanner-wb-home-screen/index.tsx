import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { OptaplannerWbHomeScreenProvider } from "./OptaplannerWbHomeScreenProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new OptaplannerWbHomeScreenProvider()));
