import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { AspNetUsersFilterRequestDto, AspNetUsersRequestDto } from '../../Models/RequestDto/AspNetUsers';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-asp-net-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './asp-net-users.component.html',
  styleUrl: './asp-net-users.component.scss',
  providers: [DatePipe]
})
export class AspNetUsersComponent implements OnInit {

  private aspnetusersGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oAspNetUsersFilterRequestDto = new AspNetUsersFilterRequestDto();
  public oAspNetUsersRequestDto = new AspNetUsersRequestDto();
  // CompanyList: any[] = [];
  roleList: any[] = [];
  public aspnetusersId = "";
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'FullName', width: 150, headerName: 'Full Name', filter: true },
    { field: 'UserName', headerName: 'User Name' },
    { field: 'Email', headerName: 'Email Address' },
    { field: 'PhoneNumber', headerName: 'Phone Number' },
    { field: 'RoleName', headerName: 'User Role' },
    { field: 'EmailConfirmed', headerName: 'Status' },
  ];
  trackByCompany: TrackByFunction<any> | any;
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.Roles();
    this.GetAspNetUsers();
  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetAspNetUsers();
  }

  onGridReadyTransection(params: any) {
    this.aspnetusersGridApi = params.api;
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
    this.GetAspNetUsers();


  }

  private Roles() {

    this.http.Get(`AspNetUsers/Roles`).subscribe(
      (res: any) => {
        this.roleList = res.Data;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAspNetUsers() {
    this.oAspNetUsersFilterRequestDto.IsActive = CommonHelper.booleanConvert(this.oAspNetUsersFilterRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/GetAspNetUsers?pageNumber=${this.pageIndex}`, this.oAspNetUsersFilterRequestDto).subscribe(
      (res: any) => {

        this.rowData = res.Items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.aspnetusersGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertAspNetUsers() {


    if (this.oAspNetUsersRequestDto.RoleId == 0) {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oAspNetUsersRequestDto.FullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.Email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.PhoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.Password == "") {
      this.toast.warning("Please enter password", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.ConfirmPassword == "") {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }


    this.oAspNetUsersRequestDto.FileId = Number(this.oAspNetUsersRequestDto.FileId)
    this.oAspNetUsersRequestDto.UserType = Number(this.oAspNetUsersRequestDto.UserType)
    this.oAspNetUsersRequestDto.RoleId = Number(this.oAspNetUsersRequestDto.RoleId);
    this.oAspNetUsersRequestDto.IsActive = CommonHelper.booleanConvert(this.oAspNetUsersRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/InsertAspNetUsers`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAspNetUsers();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateAspNetUsers() {

    if (this.oAspNetUsersRequestDto.RoleId == 0) {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oAspNetUsersRequestDto.FullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.Email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.PhoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.Password == "") {
      this.toast.warning("Please enter password", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.ConfirmPassword == "") {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }

    this.oAspNetUsersRequestDto.FileId = Number(this.oAspNetUsersRequestDto.FileId)
    this.oAspNetUsersRequestDto.UserType = Number(this.oAspNetUsersRequestDto.UserType)
    this.oAspNetUsersRequestDto.RoleId = Number(this.oAspNetUsersRequestDto.RoleId);
    this.oAspNetUsersRequestDto.IsActive = CommonHelper.booleanConvert(this.oAspNetUsersRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/UpdateAspNetUsers/${this.aspnetusersId}`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAspNetUsers();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteAspNetUsers() {
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/DeleteAspNetUsers/${this.aspnetusersId}`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetAspNetUsers();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oAspNetUsersRequestDto = new AspNetUsersRequestDto();
    this.aspnetusersId = "";
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.aspnetusersGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.aspnetusersId = getSelectedItem.Id;
    this.oAspNetUsersRequestDto = getSelectedItem;
    this.oAspNetUsersRequestDto.FileId = Number(this.oAspNetUsersRequestDto.FileId)
    this.oAspNetUsersRequestDto.UserType = Number(this.oAspNetUsersRequestDto.UserType)
    this.oAspNetUsersRequestDto.RoleId = Number(this.oAspNetUsersRequestDto.RoleId);
    this.oAspNetUsersRequestDto.IsActive = CommonHelper.booleanConvert(this.oAspNetUsersRequestDto.IsActive);
    CommonHelper.CommonButtonClick("openCommonModel");
  }


  public onFileChange(event: any): void {
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          
          this.oAspNetUsersRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.aspnetusersGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.aspnetusersId = getSelectedItem.Id;
    this.oAspNetUsersRequestDto = getSelectedItem;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetAspNetUsers();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetAspNetUsers();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetAspNetUsers();
    }
  }


}

