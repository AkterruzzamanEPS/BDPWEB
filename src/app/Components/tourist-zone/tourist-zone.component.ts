import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { TouristZoneFilterDto, TouristZoneRequestDto } from '../../Models/RequestDto/TouristZone';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';

@Component({
  selector: 'app-tourist-zone',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, NgxEditorModule],
  templateUrl: './tourist-zone.component.html',
  styleUrl: './tourist-zone.component.scss',
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class TouristZoneComponent implements OnInit {

  private touristzoneGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public oTouristZoneFilterDto = new TouristZoneFilterDto();
  public oTouristZoneRequestDto = new TouristZoneRequestDto();

  public touristzoneId = 0;
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
    { field: 'Name', width: 150, headerName: 'Tourist Spot Name', filter: true },
    { field: 'Description', width: 150, headerName: 'District', filter: true },
    { field: 'District', width: 150, headerName: 'District', filter: true },
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
    this.GetDistricts();
    this.GetTouristZone();
  }

  onGridReadyTransection(params: any) {
    this.touristzoneGridApi = params.api;
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
    this.GetTouristZone();
  }

  private GetTouristZone() {
    this.oTouristZoneFilterDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneFilterDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristZone/GetTouristZone?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oTouristZoneFilterDto).subscribe(
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
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          debugger
          this.oTouristZoneRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


  public InsertTouristZone() {
    debugger
    if (this.oTouristZoneRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oTouristZoneRequestDto.FileId = Number(this.oTouristZoneRequestDto.FileId);
    this.oTouristZoneRequestDto.DistictId = Number(this.oTouristZoneRequestDto.DistictId);
    this.oTouristZoneRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristZone/InsertTouristZone`, this.oTouristZoneRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTouristZone();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateTouristZone() {

    if (this.oTouristZoneRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oTouristZoneRequestDto.FileId = Number(this.oTouristZoneRequestDto.FileId);
    this.oTouristZoneRequestDto.DistictId = Number(this.oTouristZoneRequestDto.DistictId);
    this.oTouristZoneRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristZone/UpdateTouristZone/${this.touristzoneId}`, this.oTouristZoneRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTouristZone();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteTouristZone() {
    this.oTouristZoneRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristZoneRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristZone/DeleteTouristZone/${this.touristzoneId}`, this.oTouristZoneRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetTouristZone();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oTouristZoneRequestDto = new TouristZoneRequestDto();
    this.touristzoneId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.touristzoneGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.touristzoneId = Number(getSelectedItem.Id);
    this.oTouristZoneRequestDto.Name = getSelectedItem.Name;
    this.oTouristZoneRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTouristZoneRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oTouristZoneRequestDto.Description = getSelectedItem.Description;
    this.oTouristZoneRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTouristZoneRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.touristzoneGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

    this.touristzoneId = Number(getSelectedItem.Id);
    this.oTouristZoneRequestDto.Name = getSelectedItem.Name;
    this.oTouristZoneRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTouristZoneRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oTouristZoneRequestDto.Description = getSelectedItem.Description;
    this.oTouristZoneRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTouristZoneRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetTouristZone();
  }



}
