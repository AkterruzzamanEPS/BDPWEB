import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { MenuFilterRequestDto, MenuRequestDto } from '../../Models/RequestDto/Menu';
import { MenuPerRequestDto } from '../../Models/RequestDto/MenuPermission';
import { AspNetUsersFilterRequestDto } from '../../Models/RequestDto/AspNetUsers';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [DatePipe],  
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnInit {



  private MenuGridApi!: any;
  private MenuPermissionGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public rowDataMenuPermission!: any[];
  public oMenuFilterRequestDto = new MenuFilterRequestDto();
  public oMenuRequestDto = new MenuRequestDto();
  public oAspNetUsersFilterRequestDto = new AspNetUsersFilterRequestDto

  public MenuId = 0;

  userList: any[] = [];
  // CompanyList: any[] = [];

  trackByCompany: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;

  public oMenuPerRequestDto = new MenuPerRequestDto();
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'Name', width: 150, headerName: 'Menu name', filter: true },
    { field: 'ShortName', width: 150, headerName: 'Short name', filter: true },
    { field: 'RoutingPath', width: 150, headerName: 'RoutingPath', filter: true },
    { field: 'IsActive', headerName: 'Status' },
    { field: 'Remarks', headerName: 'Remarks' },
  ];
  public colDefsMenuPermission: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false, headerCheckboxSelection: false },
    { field: 'name', width: 150, headerName: 'Menu name', filter: true, editable: true },
  ];
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.GetMenu();
  }

  onGridReadyTransection(params: any) {
    this.MenuGridApi = params.api;
    this.rowData = [];
  }

  onGridReadyMenuPermission(params: any) {
    this.MenuPermissionGridApi = params.api;
    this.rowDataMenuPermission = [];
  }

 private GetAllUsers() {
     this.oAspNetUsersFilterRequestDto.IsActive = CommonHelper.booleanConvert(this.oAspNetUsersFilterRequestDto.IsActive);
     this.userList = [];
     this.http.Post(`AspNetUsers/GetAllAspNetUsers`, this.oAspNetUsersFilterRequestDto).subscribe(
       (res: any) => {
         this.userList = res;
       },
       (err) => {
         this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
       }
     );
 
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
    this.GetMenu();
  }
  private GetMenu() {

    let currentUser = CommonHelper.GetUser();
    this.oMenuFilterRequestDto.Name = (this.oMenuFilterRequestDto.Name);
    this.oMenuFilterRequestDto.ShortName = (this.oMenuFilterRequestDto.ShortName);
    this.oMenuFilterRequestDto.IsActive = CommonHelper.booleanConvert(this.oMenuFilterRequestDto.IsActive);

    const pageNumber = this.pageIndex ?? 1; // fallback to 1 if undefined

    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/GetMenus?pageNumber=${pageNumber}`, this.oMenuFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.MenuGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

    PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetMenu();
  }

  public InsertMenu() {
    if (this.oMenuRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oMenuRequestDto.ShortName = (this.oMenuRequestDto.ShortName);
    this.oMenuRequestDto.RoutingPath = (this.oMenuRequestDto.RoutingPath);
    this.oMenuRequestDto.IsActive = CommonHelper.booleanConvert(this.oMenuRequestDto.IsActive);
    this.oMenuRequestDto.Remarks = (this.oMenuRequestDto.Remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/InsertMenu`, this.oMenuRequestDto).subscribe(
      (res: any) => {
        if(res.StatusCode!=200){
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else{
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMenu();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }
  public UpdateMenu() {
    if (this.oMenuRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oMenuRequestDto.ShortName = (this.oMenuRequestDto.ShortName);
    this.oMenuRequestDto.RoutingPath = (this.oMenuRequestDto.RoutingPath);
    this.oMenuRequestDto.IsActive = CommonHelper.booleanConvert(this.oMenuRequestDto.IsActive);
    this.oMenuRequestDto.Remarks = (this.oMenuRequestDto.Remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/UpdateMenu/${this.MenuId}`, this.oMenuRequestDto).subscribe(
      (res: any) => {
        
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMenu();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
public DeleteMenu(): void {

  if (!this.MenuId) {
    this.toast.error("Invalid Menu ID", "Error!!", { progressBar: true });
    return;
  }

  // Convert isActive to backend-friendly format
  this.oMenuRequestDto.IsActive = CommonHelper.booleanConvert(this.oMenuRequestDto.IsActive);

  this.http.Post(`Menu/DeleteMenu/${this.MenuId}`, this.oMenuRequestDto).subscribe(
    (res: any) => {
      CommonHelper.CommonButtonClick("closeCommonDelete"); // Close the delete modal
      this.GetMenu(); // Refresh list
      this.toast.success(res?.message || "Data deleted successfully!", "Success!!", { progressBar: true });
    },
    (err) => {
      this.toast.error(err?.error?.message || "Failed to delete data", "Error!!", { progressBar: true });
    }
  );
}


  add() {
    
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oMenuRequestDto = new MenuRequestDto();
    this.MenuId = 0;
  }

  menuPermission() {
    this.GetAllUsers();
    CommonHelper.CommonButtonClick("openPerCommonModel");
    this.oMenuPerRequestDto = new MenuPerRequestDto();
    this.rowDataMenuPermission = [];
    let getSelectedRow = AGGridHelper.GetSelectedRows(this.MenuGridApi);
    getSelectedRow.forEach(element => {
      this.rowDataMenuPermission.push({ id: element.Id, name: element.Name });
    });

  }

  edit() {
    
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.MenuId = Number(getSelectedItem.Id);
    this.oMenuRequestDto.Name = getSelectedItem.Name;
    this.oMenuRequestDto.ShortName = getSelectedItem.ShortName;
    this.oMenuRequestDto.RoutingPath = getSelectedItem.RoutingPath;
    this.oMenuRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oMenuRequestDto.Remarks = getSelectedItem.Remarks;

    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
     this.MenuId = Number(getSelectedItem.Id );
    this.oMenuRequestDto.Name = getSelectedItem.Name;
    this.oMenuRequestDto.IsActive = getSelectedItem.IsActive;
    this.oMenuRequestDto.Remarks = getSelectedItem.Remarks;

    CommonHelper.CommonButtonClick("openCommonDelete");

  }



  public InsertMenuPermission() {
    
    if (this.oMenuPerRequestDto.userID == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }

    this.oMenuPerRequestDto.menues = AGGridHelper.GetRows(this.MenuPermissionGridApi);
    this.oMenuPerRequestDto.userID = (this.oMenuPerRequestDto.userID);
  
    this.oMenuPerRequestDto.IsActive = CommonHelper.booleanConvert(this.oMenuPerRequestDto.IsActive);
    this.oMenuPerRequestDto.remarks = (this.oMenuPerRequestDto.remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/InsertMenuPermission`, this.oMenuPerRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closePerCommonModel");
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public onPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageIndex = pageNumber;
      this.GetMenu();
    }
  }
  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetMenu();
    }
  }
  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetMenu();
    }
  }


}
