import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ServiceTypeFilterDto, ServiceTypeRequestDto } from '../../Models/RequestDto/ServiceType';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';

@Component({
  selector: 'app-service-type',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, FormsModule],
  templateUrl: './service-type.component.html',
  styleUrl: './service-type.component.scss',
    providers: [DatePipe],
})
export class ServiceTypeComponent implements OnInit {

  private servicetypeGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oServiceTypeFilterDto = new ServiceTypeFilterDto();
  public oServiceTypeRequestDto = new ServiceTypeRequestDto();

  public servicetypeId = 0;
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
    { field: 'Name', width: 150, headerName: 'ServiceType Name', filter: true },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'IsActive', headerName: 'Status' },
  ];

  trackByFn: TrackByFunction<any> | any;
  trackByDistrict: TrackByFunction<any> | any;
  trackByDistrictFrom: TrackByFunction<any> | any;
  trackByThana: TrackByFunction<any> | any;
  trackByThanaFrom: TrackByFunction<any> | any;
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
      this.oServiceTypeFilterDto.ServiceId = Number(serviceId);
    }
    this.GetServiceType();
  }

  onGridReadyTransection(params: any) {
    this.servicetypeGridApi = params.api;
    this.rowData = [];
  }

  Filter() {
    this.GetServiceType();
  }

  private GetServiceType() {
    this.oServiceTypeFilterDto.IsActive = CommonHelper.booleanConvert(this.oServiceTypeFilterDto.IsActive);
    this.oServiceTypeFilterDto.ServiceId = Number(this.oServiceTypeFilterDto.ServiceId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceType/GetServiceType?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oServiceTypeFilterDto).subscribe(
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






  public InsertServiceType() {
    debugger
    if (this.oServiceTypeRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oServiceTypeRequestDto.ServiceId = Number(this.oServiceTypeFilterDto.ServiceId);
    this.oServiceTypeRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceTypeRequestDto.IsActive);

    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceType/InsertServiceType`, this.oServiceTypeRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetServiceType();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateServiceType() {

    if (this.oServiceTypeRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oServiceTypeRequestDto.ServiceId = Number(this.oServiceTypeFilterDto.ServiceId);
    this.oServiceTypeRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceTypeRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceType/UpdateServiceType/${this.servicetypeId}`, this.oServiceTypeRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetServiceType();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteServiceType() {
    this.oServiceTypeRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceTypeRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceType/DeleteServiceType/${this.servicetypeId}`, this.oServiceTypeRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetServiceType();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oServiceTypeRequestDto = new ServiceTypeRequestDto();
    this.servicetypeId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.servicetypeGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.servicetypeId = Number(getSelectedItem.Id);
    this.oServiceTypeRequestDto.Name = getSelectedItem.Name;
    this.oServiceTypeRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oServiceTypeRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceTypeRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.servicetypeGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

    this.servicetypeId = Number(getSelectedItem.Id);
    this.oServiceTypeRequestDto.Name = getSelectedItem.Name;
    this.oServiceTypeRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oServiceTypeRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceTypeRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetServiceType();
  }



}
