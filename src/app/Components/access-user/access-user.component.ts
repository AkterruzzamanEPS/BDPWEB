import { Component, TrackByFunction } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { ServiceFilterDto, ServiceRequestDto } from '../../Models/RequestDto/Service';
import { ComplainFilterDto, ComplainRequestDto } from '../../Models/RequestDto/Complain';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ValueFormatterParams } from 'ag-grid-community';
import { AccessUserFilterDto, AccessUserRequestDto } from '../../Models/RequestDto/AccessUser';
import { AspNetUsersFilterRequestDto } from '../../Models/RequestDto/AspNetUsers';
import { TouristSpotFilterDto, TouristSpotRequestDto } from '../../Models/RequestDto/TouristSpot';
import { TouristZoneFilterDto } from '../../Models/RequestDto/TouristZone';

@Component({
  selector: 'app-access-user',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './access-user.component.html',
  styleUrl: './access-user.component.scss',
  providers: [DatePipe]
})
export class AccessUserComponent {

  private AccessUserGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oAccessUserFilterDto = new AccessUserFilterDto();
  public oAccessUserRequestDto = new AccessUserRequestDto();
  public oTouristZoneFilterDto = new TouristZoneFilterDto();
  public oTouristSpotFilterDto = new TouristSpotFilterDto();
  public oTouristSpotRequestDto = new TouristSpotRequestDto();


  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];
  public registeredUserList:any[] = [];
  public touristZoneList: any[] = [];
  public selectedAccessIds: number[] = [];



  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();
  public oAspNetUsersFilterRequestDto = new AspNetUsersFilterRequestDto();

  public AccessUserId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public complainCategories: any[] = [];

  public fromDate: any;
  public toDate: any;
  
 public colDefsTransection: any[] = [
   { field: 'UserId', headerName: 'User ID', width: 120 },
  { field: 'Type', headerName: 'Type', width: 100 },
  { field: 'TypeId', headerName: 'Type ID', width: 120 },
  { field: 'Remarks', headerName: 'Remarks', flex: 1 }, // flexible width
  { field: 'IsActive', headerName: 'Active Status', width: 140, 
    cellRenderer: (params: any) => params.value ? 'Active' : 'Inactive' },
  { field: 'CreatedBy', headerName: 'Created By', width: 120 },
  { field: 'CreatedDate', headerName: 'Created Date', width: 180, 
    valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleString() : '' },

  ];
  trackByCompany: TrackByFunction<any> | any;
  trackByFn: TrackByFunction<any> | any;
  
  trackByDistrict: TrackByFunction<any> | any;
  trackByDistrictFrom: TrackByFunction<any> | any;
  trackByThana: TrackByFunction<any> | any;
  trackByThanaFrom: TrackByFunction<any> | any;
  trackByTouristZone: TrackByFunction<any> | any;
  trackByTouristZoneFrom: TrackByFunction<any> | any;

  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }



  ngOnInit(): void {
   this.GetAccessUser();
   this.GetDistinctUser();
   this.GttTouristZones();

  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetAccessUser();
  }

  onGridReadyTransection(params: any) {
    this.AccessUserGridApi = params.api;
    this.rowData = [];
  }

  Filter() {
    this.GetAccessUser();


  }
  private GetDistinctUser() {
    this.oAspNetUsersFilterRequestDto.IsActive= CommonHelper.booleanConvert(this.oAspNetUsersFilterRequestDto.IsActive);
    this.oAspNetUsersFilterRequestDto.UserType = 2;

   debugger;
    this.http.Post(`AspNetUsers/GetAllAspNetUsers`, this.oAspNetUsersFilterRequestDto).subscribe(
      (res: any) => {
        debugger;
        this.registeredUserList=res;
       
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
   private GttTouristZones() {
    this.oTouristZoneFilterDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneFilterDto.IsActive);
    this.http.Post(`TouristZone/GetAllTouristZones`, this.oTouristZoneFilterDto).subscribe(
      (res: any) => {
        this.touristZoneList = res;
       
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }
  


  private GetAccessUser() {
    this.oAccessUserFilterDto.IsActive = true;
    this.oAccessUserFilterDto.Type =0;
    this.oAccessUserFilterDto.TypeId =0;
    // this.oAccessUserFilterDto.UserId = ;

    //this.oAccessUserFilterDto.UserId = String(this.oAccessUserFilterDto.UserId);
    // this.oAccessUserFilterDto.IsActive = CommonHelper.booleanConvert(this.oAccessUserFilterDto.IsActive);
    // this.oAccessUserFilterDto.Type = Number(this.oAccessUserFilterDto.Type);
    // this.oAccessUserFilterDto.TypeId = Number(this.oAccessUserFilterDto.TypeId);
    // this.oAccessUserFilterDto.UserId = String(this.oAccessUserFilterDto.UserId);
   debugger;
    this.http.Post(`AccessUser/GetAccessUsers?pageNumber=${this.pageIndex}`, this.oAccessUserFilterDto).subscribe(
      (res: any) => {
  debugger;
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.AccessUserGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

    add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oAccessUserRequestDto = new AccessUserRequestDto();
    this.AccessUserId = 0;
  }
public InsertAccessUsers() {
  debugger;

  // Validation
  if (!this.oAccessUserRequestDto.UserId || this.oAccessUserRequestDto.UserId == "0") {
    this.toast.warning("Please select a Police User", "Warning!!", { progressBar: true });
    return;
  }
  if (this.oAccessUserRequestDto.Type == 0) {
    this.toast.warning("Please select a User Type", "Warning!!", { progressBar: true });
    return;
  }

  // Set default values
  let currentUser = CommonHelper.GetUser();
  this.oAccessUserRequestDto.IsActive = CommonHelper.booleanConvert(this.oAccessUserRequestDto.IsActive);

 
  this.oAccessUserRequestDto.AccessList = this.selectedAccessIds ; 
  // API Call
  this.http.Post(`AccessUser/InsertUpdateAccessUserBulk`, this.oAccessUserRequestDto).subscribe(
    (res: any) => {
      if (res.StatusCode != 200) {
        this.toast.warning(res.message, "Warning!!", { progressBar: true });
      } else {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAccessUser();
        this.toast.success("Data Saved Successfully!!", "Success!!", { progressBar: true });
      }
    },
    (err) => {
      this.toast.error(err.message, "Error!!", { progressBar: true });
    }
  );
}

  public UpdateAccessUsers(){

  }


}
