import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Shared/login/login.component';
import { CategoryComponent } from './Components/category/category.component';
import { ResponseComponent } from './Components/response/response.component';
import { AuthGuard } from './Shared/Services/auth.guard';
import { MenuComponent } from './Components/menu/menu.component';
import { MenuPermissionComponent } from './Components/menu-permission/menu-permission.component';
import { AspNetUsersComponent } from './Components/asp-net-users/asp-net-users.component';
import { AccessDeniedComponent } from './Shared/access-denied/access-denied.component';

import { FieldTypeComponent } from './Components/FieldType/FieldTypecomponent';

import { EditorComponent } from './Shared/editor/editor.component';
import { ServiceComponent } from './Components/service/service.component';
import { ComplainComponent } from './Components/complain/complain.component';
import { ServiceDetailComponent } from './Components/service-detail/service-detail.component';
import { TouristSpotComponent } from './Components/tourist-spot/tourist-spot.component';
import { UploadComponent } from './Components/upload/upload.component';
import { TouristTripComponent } from './Components/tourist-trip/tourist-trip.component';
import { FeedBacKComponent } from './Components/feed-bac-k/feed-bac-k.component';
import { LostComponent } from './Components/lost/lost.component';
import { ServiceTypeComponent } from './Components/service-type/service-type.component';
import { FoundComponent } from './Components/found/found.component';
import { GuideComponent } from './Components/guide/guide.component';
import { PoliceStationComponent } from './Components/police-station/police-station.component';
import { NewsComponent } from './Components/news/news.component';
import { NearbyRidesComponent } from './Components/nearby-rides/nearby-rides.component';
import { ATMLocationsComponent } from './Components/atmlocations/atmlocations.component';
import { FindTransportComponent } from './Components/find-transport/find-transport.component';
import { FoodDineComponent } from './Components/food-dine/food-dine.component';
import { HealthcareServicesComponent } from './Components/healthcare-services/healthcare-services.component';
import { HotelsComponent } from './Components/hotels/hotels.component';
import { RefuelingStationsComponent } from './Components/refueling-stations/refueling-stations.component';
import { ReligiousCommunityComponent } from './Components/religious-community/religious-community.component';
import { MobileInternetComponent } from './Components/mobile-internet/mobile-internet.component';
import { RedMarkedSpotsComponent } from './Components/red-marked-spots/red-marked-spots.component';
import { TouristZoneComponent } from './Components/tourist-zone/tourist-zone.component';
import { TransportComponent } from './Components/transport/transport.component';

export const routes: Routes = [
    { path: "", component: LoginComponent, title: "Log in- BDP User Panel" },
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], title: "Dashboard | BDP ", },
    { path: "categories", component: CategoryComponent, canActivate: [AuthGuard], title: "Categories | BDP " },
    { path: "fieldTypes", component: FieldTypeComponent, canActivate: [AuthGuard], title: "FieldType | BDP " },
    { path: "services", component: ServiceComponent, canActivate: [AuthGuard], title: "Service | BDP" },
    
    { path: "complain", component: ComplainComponent, canActivate: [AuthGuard], title: "Complain List| BDP" },
    { path: "news", component: NewsComponent, canActivate: [AuthGuard], title: "News & Alert | BDP" },
    
    //for the complan details and feedback
    { path: "complain/:id", component: FeedBacKComponent, canActivate: [AuthGuard], title: "Feed Back | BDP" },

    { path: "lost", component: LostComponent, canActivate: [AuthGuard], title: "Lost List | BDP" },
    { path: "founds", component: FoundComponent, canActivate: [AuthGuard], title: "Founds List | BDP" },
    { path: "upload", component: UploadComponent, title:"Upload | BDP"},
    { path: "touristspot", component: TouristSpotComponent, canActivate: [AuthGuard], title: "Tourist Spot | BDP" },
    { path: "touristzone", component: TouristZoneComponent, canActivate: [AuthGuard], title: "Tourist Zone | BDP" },
    { path: "guide", component: GuideComponent, canActivate: [AuthGuard], title: "Guide List | BDP" },
    { path: "policestation", component: PoliceStationComponent, canActivate: [AuthGuard], title: "Police Station Spot | BDP" },
    { path: "touristtrip", component: TouristTripComponent, canActivate: [AuthGuard], title: "Tourist Trip | BDP" },
    { path: "services/:id", component: ServiceDetailComponent, canActivate: [AuthGuard], title: "Service Detail | BDP" },
    { path: "service-type/:id", component: ServiceTypeComponent, canActivate: [AuthGuard], title: "Service Type | BDP" },
    { path: "response", component: ResponseComponent, title: "Response | BDP " },
    { path: "menu", component: MenuComponent, canActivate: [AuthGuard], title: "Menu | BDP " },
    { path: "menuPermission", component: MenuPermissionComponent, canActivate: [AuthGuard], title: "MenuPermission | BDP " },
    { path: "users", component: AspNetUsersComponent, canActivate: [AuthGuard], title: "Users | BDP " },
   
    { path: "red-marked-spots/:id", component: RedMarkedSpotsComponent, canActivate: [AuthGuard], title: "Red Marked Spot | BDP " },
    { path: "find-transport/:id", component: FindTransportComponent, canActivate: [AuthGuard], title: "Find Transport | BDP " },
    { path: "religious-community/:id", component: ReligiousCommunityComponent, canActivate: [AuthGuard], title: "Religious Community | BDP " },
    { path: "healthcare-services/:id", component: HealthcareServicesComponent, canActivate: [AuthGuard], title: "Healthcare Services | BDP " },
    { path: "hotels/:id", component: HotelsComponent, canActivate: [AuthGuard], title: "Hotels | BDP " },
    { path: "refueling-stations/:id", component: RefuelingStationsComponent, canActivate: [AuthGuard], title: "Refueling Stations | BDP " },
    { path: "mobile-internet/:id", component: MobileInternetComponent, canActivate: [AuthGuard], title: "Mobile Intern | BDP " },
    { path: "atm-locations/:id", component: ATMLocationsComponent, canActivate: [AuthGuard], title: "ATM Locations | BDP " },
    { path: "food-dine/:id", component: FoodDineComponent, canActivate: [AuthGuard], title: "FoodDine | BDP " },
    { path: "nearby-rides/:id", component: NearbyRidesComponent, canActivate: [AuthGuard], title: "Nearby Rides | BDP " },
    { path: "transport/:id", component: TransportComponent, canActivate: [AuthGuard], title: " Transport | BDP " },
    { path: "editor", component: EditorComponent, title: "Editor | BDP " },
    // Lazy loading the standalone component for transaction details
    { path: 'access-denied', component: AccessDeniedComponent, title: 'Access Denied' },
    { path: '**', redirectTo: '/access-denied' }
];
