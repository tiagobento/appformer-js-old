import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { StunnerShowcaseHomeScreenProvider } from "./StunnerShowcaseHomeScreenProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new StunnerShowcaseHomeScreenProvider()));
