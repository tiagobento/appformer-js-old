import * as AppFormer from "appformer-js";
import * as React from "react";
import {SpacesScreen} from "./SpacesScreen";
import {LibraryService} from "@kiegroup-ts-generated/kie-wb-common-library-api-rpc"
import {ClusterLibraryEvent} from "@kiegroup-ts-generated/kie-wb-common-library-api"
import {AuthenticationService} from "@kiegroup-ts-generated/errai-security-server-rpc"
import {OrganizationalUnitService} from "@kiegroup-ts-generated/uberfire-structure-api-rpc"
import {NewOrganizationalUnitEvent, RemoveOrganizationalUnitEvent} from "@kiegroup-ts-generated/uberfire-structure-api"
import {PreferenceBeanServerStore} from "@kiegroup-ts-generated/uberfire-preferences-api-rpc";

export class SpacesScreenAppFormerComponent extends AppFormer.Screen {

    private self: SpacesScreen;

    constructor() {
        super("LibraryOrganizationalUnitsScreen");
        this.af_isReact = true;
        this.af_componentTitle = "Spaces screen";
        this.af_subscriptions = new Map<string, (e: any) => void>([
            [NewOrganizationalUnitEvent.__fqcn(), (e: NewOrganizationalUnitEvent) => this.self.refreshSpaces()],
            [RemoveOrganizationalUnitEvent.__fqcn(), (e: RemoveOrganizationalUnitEvent) => this.self.refreshSpaces()],
            [ClusterLibraryEvent.__fqcn(), (e: ClusterLibraryEvent) => this.self.refreshSpaces()],
        ]);
    }

    public af_onOpen(): void {
        this.self.refreshSpaces();
    }

    public af_componentRoot(): AppFormer.Element {
        return <SpacesScreen exposing={ref => this.self = ref()}
                             libraryService={new LibraryService()}
                             authenticationService={new AuthenticationService()}
                             organizationalUnitService={new OrganizationalUnitService()}
                             preferenceBeanServerStore={new PreferenceBeanServerStore()}/>;

    }

}

AppFormer.register(new SpacesScreenAppFormerComponent());