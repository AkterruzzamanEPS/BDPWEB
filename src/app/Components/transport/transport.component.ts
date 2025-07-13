import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { EndingPointFilterDto, StartingPointFilterDto, TransportFilterDto, TransportRequestDto } from '../../Models/RequestDto/Transport';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, RouterModule, PaginationComponent, NgxEditorModule ],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class TransportComponent  implements OnInit {

  private transportGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public startingpointList: any[] = [];
  public startingpointFromList: any[] = [];
  public endingpointList: any[] = [];
  public endingpointFromList: any[] = [];
  public oEndingPointFilterDto = new EndingPointFilterDto();
  public oEndingPointFilterDtoFrom = new EndingPointFilterDto();
  public oStartingPointFilterDto = new StartingPointFilterDto();
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
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'Name', width: 150, headerName: 'Transport Name', filter: true },
    { field: 'PhoneNo', width: 150, headerName: 'PhoneNo', filter: true },
    { field: 'Driver', width: 150, headerName: 'Driver', filter: true },
    { field: 'Cost', width: 150, headerName: 'Cost', filter: true },
    { field: 'Seat', width: 150, headerName: 'Seat', filter: true },
    { field: 'Address', width: 150, headerName: 'Address', filter: true },
    { field: 'StartTime', width: 150, headerName: 'StartTime', filter: true },
    { field: 'EndTime', width: 150, headerName: 'EndTime', filter: true },
    { field: 'StartingPoint', width: 150, headerName: 'StartingPoint', filter: true },
    { field: 'EndingPoint', width: 150, headerName: 'EndingPoint', filter: true },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
    { field: 'Latitude', width: 150, headerName: 'Latitude', filter: true },
    { field: 'Longitude', width: 150, headerName: 'Longitude', filter: true },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'IsActive', headerName: 'Status' },
  ];

  trackByFn: TrackByFunction<any> | any;
  trackByStartingPoint: TrackByFunction<any> | any;
  trackByStartingPointFrom: TrackByFunction<any> | any;
  trackByEndingPoint: TrackByFunction<any> | any;
  trackByEndingPointFrom: TrackByFunction<any> | any;
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
    this.GetStartingPoints();
    this.GetEndingPoints();
    this.GetTransport();
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


  private GetStartingPoints() {
    this.oStartingPointFilterDto.ServiceId = Number(this.oTransportFilterDto.ServiceId);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/GetTransportsFrom`, this.oStartingPointFilterDto).subscribe(
      (res: any) => {
        this.startingpointList = res;
        this.startingpointFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  private GetEndingPoints() {
    this.oEndingPointFilterDto.ServiceId = Number(this.oTransportFilterDto.ServiceId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Transport/GetTransportsTo`, this.oEndingPointFilterDto).subscribe(
      (res: any) => {
        this.endingpointList = res;
        this.endingpointFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

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
    this.oTransportRequestDto.Driver = getSelectedItem.Driver;
    this.oTransportRequestDto.Model = getSelectedItem.Model;
    this.oTransportRequestDto.Cost = getSelectedItem.Cost;
    this.oTransportRequestDto.Address = getSelectedItem.Address;
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(getSelectedItem.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(getSelectedItem.EndTime);
    this.oTransportRequestDto.Latitude = getSelectedItem.Latitude;
    this.oTransportRequestDto.Longitude = getSelectedItem.Longitude;
    this.oTransportRequestDto.StartingPoint = getSelectedItem.StartingPoint;
    this.oTransportRequestDto.EndingPoint = getSelectedItem.EndingPoint;
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
    this.oTransportRequestDto.Driver = getSelectedItem.Driver;
    this.oTransportRequestDto.Model = getSelectedItem.Model;
    this.oTransportRequestDto.Cost = getSelectedItem.Cost;
    this.oTransportRequestDto.Address = getSelectedItem.Address;
    this.oTransportRequestDto.StartTime = CommonHelper.formatTime(getSelectedItem.StartTime);
    this.oTransportRequestDto.EndTime = CommonHelper.formatTime(getSelectedItem.EndTime);
    this.oTransportRequestDto.Latitude = getSelectedItem.Latitude;
    this.oTransportRequestDto.Longitude = getSelectedItem.Longitude;
    this.oTransportRequestDto.StartingPoint = getSelectedItem.StartingPoint;
    this.oTransportRequestDto.EndingPoint = getSelectedItem.EndingPoint;
    this.oTransportRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTransportRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetTransport();
  }



}
