import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { TouristSpotFilterDto, TouristSpotRequestDto } from '../../Models/RequestDto/TouristSpot';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { TouristZoneFilterDto } from '../../Models/RequestDto/TouristZone';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, NgxEditorModule],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class GuideComponent {

  private touristspotGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];
  public touristZoneList: any[] = [];
  public touristZoneFromList: any[] = [];
  // newly added by shagor
  public touristSpotList: any[] = [];
  public selectedTouristSpotIds: number[] = [];
public selectedTouristSpots: any[] = [];


  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();
  public oTouristZoneFilterDto = new TouristZoneFilterDto();

  public oTouristSpotFilterDto = new TouristSpotFilterDto();
  public oTouristSpotRequestDto = new TouristSpotRequestDto();

  public touristspotId = 0;
  public editor: Editor = new Editor();
  public toolbar: Toolbar;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];
  public currentTouristSpotId: number = 0;

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    {
      field: 'Type',
      headerName: 'Type',
      width: 180,
      filter: true,
      cellRenderer: (params: any) => {
        let label = '';
        let colorClass = '';

        switch (params.value) {
          case 1:
            label = 'Tourist Spot';
            colorClass = 'badge bg-info text-dark';
            break;
          case 2:
            label = 'Police Station';
            colorClass = 'badge bg-primary';
            break;
          case 3:
            label = 'Guide';
            colorClass = 'badge bg-success';
            break;
          default:
            label = 'Unknown';
            colorClass = 'badge bg-secondary';
            break;
        }

        return `<span class="${colorClass}" style="font-size: 0.9rem; padding: 6px 10px;">${label}</span>`;
      }
    },
    { field: 'Name', width: 150, headerName: 'Tourist Spot Name', filter: true },
    { field: 'PhoneNo', width: 150, headerName: 'PhoneNo', filter: true },
    { field: 'TelePhone', width: 150, headerName: 'TelePhone', filter: true },
    { field: 'InchargeName', width: 150, headerName: 'Incharge', filter: true },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
    { field: 'Address', width: 150, headerName: 'Address', filter: true },
    { field: 'Division', width: 150, headerName: 'Division', filter: true },
    { field: 'District', width: 150, headerName: 'District', filter: true },
    { field: 'Thana', width: 150, headerName: 'Thana', filter: true },
    { field: 'Lat', width: 150, headerName: 'Lat', filter: true },
    { field: 'Long', width: 150, headerName: 'Long', filter: true },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'IsActive', headerName: 'Status' },
  ];

  trackByFn: TrackByFunction<any> | any;
  trackByDistrict: TrackByFunction<any> | any;
  trackByDistrictFrom: TrackByFunction<any> | any;
  trackByThana: TrackByFunction<any> | any;
  trackByThanaFrom: TrackByFunction<any> | any;
  trackByTouristZone: TrackByFunction<any> | any;
  trackByTouristZoneFrom: TrackByFunction<any> | any;
  trackByTouristSpot: TrackByFunction<any> = (index: number, item: any) => item.Id;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.toolbar = CommonHelper.GetToolBar();
  }


  ngOnInit(): void {
    this.GttTouristZones();
    this.GetDistricts();
    this.GetTouristSpot();
    this.GetTouristSpotsByZone();
  }

  onGridReadyTransection(params: any) {
    this.touristspotGridApi = params.api;
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
    this.GetTouristSpot();
    
  }

  private GetTouristSpot() {
    this.oTouristSpotFilterDto.IsActive = CommonHelper.booleanConvert(this.oTouristSpotFilterDto.IsActive);
    this.oTouristSpotFilterDto.DistictId = Number(this.oTouristSpotFilterDto.DistictId);
    this.oTouristSpotFilterDto.TouristZoneId = Number(this.oTouristSpotFilterDto.TouristZoneId);
    this.oTouristSpotFilterDto.ThanaId = Number(this.oTouristSpotFilterDto.ThanaId);
    this.oTouristSpotFilterDto.Type = 3;
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristSpot/GetTouristSpot?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oTouristSpotFilterDto).subscribe(
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

 private GetTouristSpotsByZone() {
  debugger
  this.oTouristSpotRequestDto.TouristZoneId=Number(this.oTouristSpotRequestDto.TouristZoneId);
  this.oTouristSpotRequestDto.Type=1;
  this.http.Post(`TouristSpot/GetAllTouristSpotsFilter`, this.oTouristSpotRequestDto).subscribe(
    (res: any) => {
      this.touristSpotList = res;
    },
    (err) => {
      this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      this.touristSpotList = [];
    }
  );
}
public onTouristZoneChange(event: any) {
  debugger
  this.oTouristSpotRequestDto.TouristZoneId = Number(event.target.value);
  this.touristSpotList = [];
  this.selectedTouristSpotIds = [];
  this.selectedTouristSpots = [];
  this.oTouristSpotRequestDto.TouristSpotIds = '';
  this.currentTouristSpotId = 0;
  this.GetTouristSpotsByZone();
  
}
public addTouristSpot() {
  debugger
    if (this.currentTouristSpotId && this.currentTouristSpotId !== 0) {
        console.log('Selected ID:', this.currentTouristSpotId); // Debug
        console.log('Tourist List:', this.touristSpotList); // Debug
        const selectedSpot = this.touristSpotList.find(item => item.Id == this.currentTouristSpotId);
        console.log('Found Spot:', selectedSpot); // Debug
        if (selectedSpot) {
            if (!this.selectedTouristSpotIds.includes(selectedSpot.Id)) {
                this.selectedTouristSpotIds.push(selectedSpot.Id);
                this.selectedTouristSpots.push(selectedSpot);
                this.oTouristSpotRequestDto.TouristSpotIds = this.selectedTouristSpots.map(item => item.Name).join(',');
                console.log('Updated Spots:', this.selectedTouristSpots); // Debug
            } else {
                this.toast.warning(`${selectedSpot.Name} is already selected!`, "Warning!!", { progressBar: true });
            }
        } else {
            this.toast.warning('Selected tourist spot not found!', "Error!!", { progressBar: true });
        }
        this.currentTouristSpotId = 0; // Reset dropdown
        this.cdr.detectChanges(); // Force UI update
        // Fallback: Force re-render if still not visible
        setTimeout(() => this.cdr.detectChanges(), 0);
    }
}

public removeTouristSpot(id: number) {
  this.selectedTouristSpotIds = this.selectedTouristSpotIds.filter(itemId => itemId !== id);
  this.selectedTouristSpots = this.touristSpotList.filter(item => this.selectedTouristSpotIds.includes(Number(item.Id)));
  this.oTouristSpotRequestDto.TouristSpotIds = this.selectedTouristSpots.map(item => item.Name).join(',');
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

          this.oTouristSpotRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


  public InsertTouristSpot() {
debugger
    if (this.oTouristSpotRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oTouristSpotRequestDto.FileId = Number(this.oTouristSpotRequestDto.FileId);
    this.oTouristSpotRequestDto.DistictId = Number(this.oTouristSpotRequestDto.DistictId);
    this.oTouristSpotRequestDto.ThanaId = Number(this.oTouristSpotRequestDto.ThanaId);
    this.oTouristSpotRequestDto.TouristZoneId = Number(this.oTouristSpotRequestDto.TouristZoneId);
    this.oTouristSpotRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristSpotRequestDto.IsActive);
    this.oTouristSpotRequestDto.Type = 3;

    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristSpot/InsertTouristSpot`, this.oTouristSpotRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTouristSpot();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateTouristSpot() {

    if (this.oTouristSpotRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oTouristSpotRequestDto.FileId = Number(this.oTouristSpotRequestDto.FileId);
    this.oTouristSpotRequestDto.DistictId = Number(this.oTouristSpotRequestDto.DistictId);
    this.oTouristSpotRequestDto.ThanaId = Number(this.oTouristSpotRequestDto.ThanaId);
    this.oTouristSpotRequestDto.TouristZoneId = Number(this.oTouristSpotRequestDto.TouristZoneId);
    this.oTouristSpotRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristSpotRequestDto.IsActive);
    this.oTouristSpotRequestDto.Type = 3;
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristSpot/UpdateTouristSpot/${this.touristspotId}`, this.oTouristSpotRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetTouristSpot();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteTouristSpot() {
    this.oTouristSpotRequestDto.IsActive = CommonHelper.booleanConvert(this.oTouristSpotRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristSpot/DeleteTouristSpot/${this.touristspotId}`, this.oTouristSpotRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetTouristSpot();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oTouristSpotRequestDto = new TouristSpotRequestDto();
    this.touristspotId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.touristspotGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.touristspotId = Number(getSelectedItem.Id);
    this.oTouristSpotRequestDto.Name = getSelectedItem.Name;
    this.oTouristSpotRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTouristSpotRequestDto.TouristZoneId = Number(getSelectedItem.TouristZoneId);
    this.oTouristSpotRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oTouristSpotRequestDto.ThanaId = Number(getSelectedItem.ThanaId);
    this.oTouristSpotRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oTouristSpotRequestDto.TelePhone = getSelectedItem.TelePhone;
    this.oTouristSpotRequestDto.Description = getSelectedItem.Description;
    this.oTouristSpotRequestDto.InchargeName = getSelectedItem.InchargeName;
    this.oTouristSpotRequestDto.Address = getSelectedItem.Address;
    this.oTouristSpotRequestDto.Lat = getSelectedItem.Lat;
    this.oTouristSpotRequestDto.Long = getSelectedItem.Long;
    this.oTouristSpotRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTouristSpotRequestDto.Remarks = getSelectedItem.Remarks;

    this.selectedTouristSpotIds = this.oTouristSpotRequestDto.TouristSpotIds
        ? this.touristSpotList
            .filter(item => this.oTouristSpotRequestDto.TouristSpotIds.split(',').includes(item.Name))
            .map(item => Number(item.Id))
        : [];
    this.selectedTouristSpots = this.touristSpotList.filter(item => this.selectedTouristSpotIds.includes(Number(item.Id)));




    this.GetThanasFrom();

    if (this.oTouristSpotRequestDto.TouristZoneId > 0) {
        this.GetTouristSpotsByZone();
    }
    this.cdr.detectChanges();
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.touristspotGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

    this.touristspotId = Number(getSelectedItem.Id);
    this.oTouristSpotRequestDto.Name = getSelectedItem.Name;
    this.oTouristSpotRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oTouristSpotRequestDto.TouristZoneId = Number(getSelectedItem.TouristZoneId);
    this.oTouristSpotRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oTouristSpotRequestDto.ThanaId = Number(getSelectedItem.ThanaId);
    this.oTouristSpotRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oTouristSpotRequestDto.TelePhone = getSelectedItem.TelePhone;
    this.oTouristSpotRequestDto.Description = getSelectedItem.Description;
    this.oTouristSpotRequestDto.Lat = getSelectedItem.Lat;
    this.oTouristSpotRequestDto.Long = getSelectedItem.Long;
    this.oTouristSpotRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oTouristSpotRequestDto.Remarks = getSelectedItem.Remarks;
    this.selectedTouristSpotIds = this.oTouristSpotRequestDto.TouristSpotIds
        ? this.touristSpotList
            .filter(item => this.oTouristSpotRequestDto.TouristSpotIds.split(',').includes(item.Name))
            .map(item => Number(item.Id))
        : [];
    this.selectedTouristSpots = this.touristSpotList.filter(item => this.selectedTouristSpotIds.includes(Number(item.Id)));
    if (this.oTouristSpotRequestDto.TouristZoneId > 0) {
        this.GetTouristSpotsByZone();
    }
    this.cdr.detectChanges();
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetTouristSpot();
  }


}
