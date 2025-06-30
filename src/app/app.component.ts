import { AfterViewChecked, Component, DoCheck, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./Shared/header/header.component";
import { LeftSideBarComponent } from "./Shared/left-side-bar/left-side-bar.component";
import { AuthService } from './Shared/Services/auth.service';
import { LayoutService } from './Shared/Services/layout.service';
import { FooterComponent } from './Shared/footer/footer.component';
// Angular Chart Component
import { CommonModule } from '@angular/common';
import { CommonHelper } from './Shared/Services/CommonHelper';
import { HttpHelperService } from './Shared/Services/http-helper.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, LeftSideBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [LayoutService, AuthService, HttpHelperService, CommonHelper]
})
export class AppComponent implements OnInit, AfterViewChecked, DoCheck {

  public bodyHeight = 400;
  public leftSideHeight = 400;
  title = 'MerchantUser';

  constructor(private layout: LayoutService, public authService: AuthService) {
  }
  ngDoCheck(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
  }

  ngAfterViewChecked(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
  }

  ngOnInit(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
    console.log(this.bodyHeight);
    console.log(this.leftSideHeight);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          console.log('Latitude:', latitude, 'Longitude:', longitude);

          // Send to Web API
          console.log(latitude, longitude);
          console.log("Distance : ",CommonHelper.getDistanceFromLatLonInKm(latitude, longitude, 23.7594, 90.3788));
        },
        error => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

}

