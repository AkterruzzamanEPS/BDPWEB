import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
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

@Component({
  selector: 'app-found',
  standalone: true,
 imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './found.component.html',
  styleUrl: './found.component.scss',
    providers: [DatePipe]
})
export class FoundComponent {

   private complainGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oComplainFilterDto = new ComplainFilterDto();
  public oComplainRequestDto = new ComplainRequestDto();


  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public ComplainId = 0;
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
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'Name', width: 150, headerName: 'Title', filter: true },
    {
      field: 'Type', width: 150, headerName: 'Type', filter: true, cellRenderer: (params: any) => {
        let color = '';
        let text = '';

        switch (params.value) {
          case '1':
            text = 'Found';
            color = 'green';
            break;
          case '2':
            text = 'Lost';
            color = 'red';
            break;
          case '3':
            text = 'Complain';
            color = 'orange';
            break;
          default:
            text = params.value;
            color = 'black';
        }

        return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
      }
    },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
    { field: 'Address', width: 150, headerName: 'Address', filter: true },
   
    { field: 'Remarks', headerName: 'Remarks' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        let label = '';
        let colorClass = '';

        switch (params.value) {
          case 1:
            label = 'In Progress';
            colorClass = 'badge bg-warning text-dark';
            break;
          case 2:
            label = 'Found';
            colorClass = 'badge bg-success';
            break;
          case 3:
            label = 'Lost';
            colorClass = 'badge bg-danger';
            break;
          case 4:
            label = 'Solved';
            colorClass = 'badge bg-primary';
            break;
          default:
            label = 'Unknown';
            colorClass = 'badge bg-secondary';
            break;
        }

        return `<span class="${colorClass}">${label}</span>`;
      }
    },
    { field: 'Details', headerName: 'Details', width: 100, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },


    //{ field: 'Status', headerName: 'Status', cellRenderer: (params: any) => params.value ? 'Active' : 'Inactive' },
  ];
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

private GetComplainCategories() {
  
  this.http.Get(`Complain/GetComplaincategory`).subscribe(
    (res: any) => {
      this.complainCategories = res;
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

  get isComplainType(): boolean {
    return this.oComplainRequestDto.Type == '3';
  }



  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      //this.http.UploadFile(`FileManagement/FileUpload`, file).subscribe(
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oComplainRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

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

  public districtChange() {
    this.GetThanas();
  }
  public districtChangeFrom() {

    this.oThanaFilterDtoFrom.DistinctId = this.oComplainRequestDto.DistrictId;
    if(this.oComplainRequestDto.DistrictId>0){
      this.GetThanasFrom();
    }
  }



  ngOnInit(): void {
    this.GetComplains();
    this.GetDistricts();
    this.GetComplainCategories();

  }

  onGridReadyTransection(params: any) {
    this.complainGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('complain/' + params.data.Id)
    });
    return eDiv;
  }

  Filter() {
    this.pageIndex = 1;
    this.GetComplains();
  }
  private GetComplains() {
    
    let currentUser = CommonHelper.GetUser();
    const from = new Date(this.fromDate);
    from.setDate(from.getDate() - 15);
    this.oComplainFilterDto.FromDate = from;

    const to = new Date(this.toDate);
    to.setDate(to.getDate() + 15);
    this.oComplainFilterDto.ToDate = to;

    // this.oComplainFilterDto.FromDate = new Date(this.fromDate)
    // this.oComplainFilterDto.ToDate = new Date(this.toDate);
    this.oComplainFilterDto.Status = Number(this.oComplainFilterDto.Status);
    this.oComplainFilterDto.ComplainCatagoryType = Number(this.oComplainFilterDto.ComplainCatagoryType);
    this.oComplainFilterDto.IsActive = CommonHelper.booleanConvert(this.oComplainFilterDto.IsActive);
    this.oComplainFilterDto.Type='1';


    this.http.Post(`Complain/GetComplains?pageNumber=${this.pageIndex}`, this.oComplainFilterDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages);
      },
      (err) => {
        this.toast.error(err?.ErrorMessage || "Something went wrong", "Error!!", { progressBar: true });
      }
    );
  }

  

  public InsertService() {

    if (this.oComplainRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oComplainRequestDto.UserID = CommonHelper.GetUser()?.UserId ?? '';
    this.oComplainRequestDto.Status = 1;
     this.oComplainRequestDto.Type='1';

    this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(this.oComplainRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    
    this.http.Post(`Complain/InsertComplain`, this.oComplainRequestDto).subscribe(
      (res: any) => {

        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetComplains();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });


      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateService() {

    if (this.oComplainRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(this.oComplainRequestDto.IsActive);
     
     this.oComplainRequestDto.Type='1';
    // After the hash is generated, proceed with the API call
    this.http.Post(`Complain/UpdateComplain/${this.ComplainId}`, this.oComplainRequestDto).subscribe(
      (res: any) => {

        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetComplains();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteService() {
    
    this.http.Post(`Complain/DeleteComplain/${this.ComplainId}`, this.oComplainRequestDto).subscribe(
      (res: any) => {
        // Close modal manually
        const closeBtn = document.getElementById('closeCommonDelete');
        if (closeBtn) {
          (closeBtn as HTMLButtonElement).click();
        }

        this.GetComplains();
        this.toast.success("Complaint deleted successfully!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err?.ErrorMessage || "Failed to delete complaint", "Error!!", { progressBar: true });
      }
    );
  }


  add() {
    CommonHelper.CommonButtonClick("exampleModal");
    this.oComplainRequestDto = new ComplainRequestDto();
    this.ComplainId = 0;
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }



  edit() {
    const getSelectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
    if (!getSelectedItem) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true });
      return;
    }

    this.ComplainId = Number(getSelectedItem.Id);
    const id = this.ComplainId;  // Fix here

    this.http.Get(`Complain/GetComplainById/${id}`).subscribe(
      (res: any) => {
        this.oComplainRequestDto = res;

        // Make sure dates are converted properly if needed, e.g.
        this.oComplainRequestDto.Date = new Date(this.oComplainRequestDto.Date);

           // Set the category ID from the response
            if (res.ComplainCatagoryType) {
                this.oComplainRequestDto.ComplainCatagoryType = res.ComplainCatagoryType;
            }

        // Load dependent dropdowns based on DistrictId
        this.districtChangeFrom();

        // Show modal
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      (err) => {
        this.toast.error("Failed to load complaint details", "Error!!", { progressBar: true });
      }
    );
  }



  delete() {
    
    const selectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
    if (!selectedItem) {
      this.toast.warning("Please select a complaint to delete.", "Warning!!", { progressBar: true });
      return;
    }

    this.ComplainId = selectedItem.Id;

    // Optionally, only set minimal data for deletion
    this.oComplainRequestDto = new ComplainRequestDto();
    this.oComplainRequestDto.Id = this.ComplainId;
    this.oComplainRequestDto.UserID = CommonHelper.GetUser()?.UserId ?? '';
    this.oComplainRequestDto.IsActive = false; // optional: flag it as "soft deleted"

    // Show confirmation modal
    const deleteModalEl = document.getElementById('staticCommonBackdrop');
    if (deleteModalEl) {
      const modal = new (window as any).bootstrap.Modal(deleteModalEl);
      modal.show();
    }
  }


  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetComplains();
  }


}
