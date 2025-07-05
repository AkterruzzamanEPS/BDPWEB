import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { TouristZoneFilterDto } from '../../Models/RequestDto/TouristZone';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { TransportFilterDto, TransportRequestDto } from '../../Models/RequestDto/Transport';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, RouterModule, PaginationComponent, NgxEditorModule ],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class TransportComponent implements OnInit {

  private transportGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];
  public touristZoneList: any[] = [];
  public touristZoneFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public oTouristZoneFilterDto = new TouristZoneFilterDto();

  public oTransportFilterDto = new TransportFilterDto();
  public oTransportRequestDto = new TransportRequestDto();

  public transportId = 0;
  public editor: Editor = new Editor();
  public toolbar: Toolbar;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
   { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 70, editable: false },
   { field: 'Name', width: 150, headerName: 'Transport Name', filter: true },
   { field: 'PhoneNo', width: 120, headerName: 'Phone No', filter: true },
   { field: 'Description', width: 180, headerName: 'Description', filter: true },
   { field: 'Latitude', width: 120, headerName: 'Latitude', filter: true },
   { field: 'Longitude', width: 120, headerName: 'Longitude', filter: true },
   { field: 'StartingPoint', width: 150, headerName: 'Starting Point', filter: true },
   { field: 'EndingPoint', width: 150, headerName: 'Ending Point', filter: true },
   { field: 'IsActive', width: 100, headerName: 'Status', filter: true },
   { field: 'Remarks', width: 200, headerName: 'Remarks', filter: true }
  ];

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
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe) {
    this.toolbar = CommonHelper.GetToolBar();
  }


  ngOnInit(): void {
    var serviceId = this.activeRouter.snapshot.paramMap.get('id');
    if (serviceId != null) {
      this.oTransportFilterDto.ServiceId = Number(serviceId);
    }
    this.GetDistricts();
    this.GetTransport();
    this.GttTouristZones();
  }

  onGridReadyTransection(params: any) {
    this.transportGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }

  Filter() {
    this.GetTransport();
  }
  private GttTouristZones() {
    this.oTouristZoneFilterDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneFilterDto.IsActive);
    this.http.Post(`TouristZone/GetAllTouristZones`, this.oTouristZoneFilterDto).subscribe(
      (res: any) => {
        this.touristZoneList = res;
        this.touristZoneFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


  private GetTransport() {
    this.oTransportFilterDto.IsActive = CommonHelper.booleanConvert(this.oTransportFilterDto.IsActive);
    this.oTransportFilterDto.ServiceId = Number(this.oTransportFilterDto.ServiceId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/GetTransports?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oTransportFilterDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  private GetDistricts() {
    this.oDistrictFilterDto.IsActive = CommonHelper.booleanConvert(this.oDistrictFilterDto.IsActive);
    this.oDistrictFilterDto.Type = Number(this.oDistrictFilterDto.Type);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetAllDistricts`, this.oDistrictFilterDto).subscribe(
      (res: any) => {
        this.districtList = res;
        this.districtFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  private GetThanas() {
    this.oThanaFilterDto.IsActive = CommonHelper.booleanConvert(this.oThanaFilterDto.IsActive);
    this.oThanaFilterDto.Type = Number(this.oThanaFilterDto.Type);
    this.oThanaFilterDto.DistinctId = Number(this.oThanaFilterDto.DistinctId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetAllThanas`, this.oThanaFilterDto).subscribe(
      (res: any) => {
        this.thanaList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetThanasFrom() {
    this.oThanaFilterDtoFrom.IsActive = CommonHelper.booleanConvert(this.oThanaFilterDtoFrom.IsActive);
    this.oThanaFilterDtoFrom.Type = Number(this.oThanaFilterDtoFrom.Type);
    this.oThanaFilterDtoFrom.DistinctId = Number(this.oThanaFilterDtoFrom.DistinctId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetAllThanas`, this.oThanaFilterDtoFrom).subscribe(
      (res: any) => {
        this.thanaFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public districtChange(event: any) {
    this.oThanaFilterDto.DistinctId = Number(event.target.value);
    this.thanaList = [];
    this.GetThanas();
  }
  public districtChangeFrom(event: any) {
    this.oThanaFilterDtoFrom.DistinctId = Number(event.target.value);
    this.thanaFromList = [];
    this.GetThanasFrom();
  }


  public onFileChange(event: any): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {

          this.oTransportRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


  public InsertTransport() {

    if (this.oTransportRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.PhoneNo == "") {
      this.toast.warning("Please enter Phone Number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oTransportRequestDto.StartTime == "") {
      this.toast.warning("Please Select Time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.EndTime == "") {
      this.toast.warning("Please Select Time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.Latitude == "") {
      this.toast.warning("Please enter lat", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.Longitude == "") {
      this.toast.warning("Please enter long", "Warning!!", { progressBar: true });
      return;
    }
    debugger
    let currentUser = CommonHelper.GetUser();
    this.oTransportRequestDto.ServiceId = Number(this.oTransportFilterDto.ServiceId);
    this.oTransportRequestDto.FileId = Number(this.oTransportRequestDto.FileId);
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(this.oTransportRequestDto.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(this.oTransportRequestDto.EndTime);
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(this.oTransportRequestDto.IsActive);
   
    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/InsertTransport`, this.oTransportRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTransport();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateTransport() {

    if (this.oTransportRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.PhoneNo == "") {
      this.toast.warning("Please enter Phone Number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oTransportRequestDto.StartTime == "") {
      this.toast.warning("Please Select Time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.EndTime == "") {
      this.toast.warning("Please Select Time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.Latitude == "") {
      this.toast.warning("Please enter lat", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oTransportRequestDto.Longitude == "") {
      this.toast.warning("Please enter long", "Warning!!", { progressBar: true });
      return;
    }
    
    let currentUser = CommonHelper.GetUser();
    this.oTransportRequestDto.ServiceId = Number(this.oTransportFilterDto.ServiceId);
    this.oTransportRequestDto.FileId = Number(this.oTransportRequestDto.FileId);
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(this.oTransportRequestDto.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(this.oTransportRequestDto.EndTime);
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(this.oTransportRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/UpdateTransport/${this.transportId}`, this.oTransportRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTransport();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteTransport() {
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(this.oTransportRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/DeleteTransport/${this.transportId}`, this.oTransportRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetTransport();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oTransportRequestDto = new TransportRequestDto();
    this.transportId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.transportGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.transportId = Number(getSelectedItem.Id);
    this.oTransportRequestDto.Name = getSelectedItem.Name;
    this.oTransportRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oTransportRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTransportRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oTransportRequestDto.Description = getSelectedItem.Description;
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(getSelectedItem.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(getSelectedItem.EndTime);
    this.oTransportRequestDto.Latitude = getSelectedItem.Latitude;
    this.oTransportRequestDto.Longitude = getSelectedItem.Longitude;
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTransportRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.transportGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

       this.transportId = Number(getSelectedItem.Id);
    this.oTransportRequestDto.Name = getSelectedItem.Name;
    this.oTransportRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oTransportRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTransportRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oTransportRequestDto.Description = getSelectedItem.Description;
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(getSelectedItem.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(getSelectedItem.EndTime);
    this.oTransportRequestDto.Latitude = getSelectedItem.Latitude;
    this.oTransportRequestDto.Longitude = getSelectedItem.Longitude;
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTransportRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetTransport();
  }



}

