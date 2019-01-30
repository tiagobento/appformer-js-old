import * as AppFormer from "appformer-js";
import * as HomeApi from "../home-screen-api";
import { JbpmWbHomeScreenProvider } from "./JbpmWbHomeScreenProvider";

AppFormer.register(new HomeApi.HomeScreenAppFormerComponent(new JbpmWbHomeScreenProvider()));
