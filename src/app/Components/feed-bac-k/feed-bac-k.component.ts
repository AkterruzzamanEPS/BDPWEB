import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FeedBacKFilterDto, FeedBacKRequestDto } from '../../Models/RequestDto/FeedBacK';

@Component({
  selector: 'app-feed-bac-k',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, NgxEditorModule, FormsModule],
  templateUrl: './feed-bac-k.component.html',
  styleUrl: './feed-bac-k.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class FeedBacKComponent implements OnInit {

  private feedbackGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oFeedBacKFilterDto = new FeedBacKFilterDto();
  public oFeedBacKRequestDto = new FeedBacKRequestDto();

  public feedbackId = 0;
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
    { field: 'Name', width: 150, headerName: 'FeedBacK Name', filter: true },
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
      this.oFeedBacKFilterDto.ReferanceTypeID = Number(serviceId);
      this.feedbackId = Number(serviceId);
    }
    this.GetFeedBacK();
  }

  onGridReadyTransection(params: any) {
    this.feedbackGridApi = params.api;
    this.rowData = [];
  }

  Filter() {
    this.GetFeedBacK();
  }

  private GetFeedBacK() {
    this.oFeedBacKFilterDto.IsActive = CommonHelper.booleanConvert(this.oFeedBacKFilterDto.IsActive);
    this.oFeedBacKFilterDto.ReferanceTypeID = Number(this.oFeedBacKFilterDto.ReferanceTypeID);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FeedBacK/GetFeedBacks?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oFeedBacKFilterDto).subscribe(
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

  public InsertFeedBacK() {
    debugger
    if (this.oFeedBacKRequestDto.Feedback == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oFeedBacKRequestDto.ReferanceType = Number(this.oFeedBacKFilterDto.ReferanceTypeID);
    this.oFeedBacKRequestDto.IsActive = CommonHelper.booleanConvert(this.oFeedBacKRequestDto.IsActive);

    // After the hash is generated, proceed with the API call
    this.http.Post(`FeedBacK/InsertFeedBacK`, this.oFeedBacKRequestDto).subscribe(
      (res: any) => {

        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetFeedBacK();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });

      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateFeedBacK() {

    if (this.oFeedBacKRequestDto.Feedback == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oFeedBacKRequestDto.ReferanceTypeID = Number(this.oFeedBacKFilterDto.ReferanceTypeID);
    this.oFeedBacKRequestDto.IsActive = CommonHelper.booleanConvert(this.oFeedBacKRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FeedBacK/UpdateFeedBacK/${this.feedbackId}`, this.oFeedBacKRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetFeedBacK();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteFeedBacK() {
    this.oFeedBacKRequestDto.IsActive = CommonHelper.booleanConvert(this.oFeedBacKRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FeedBacK/DeleteFeedBacK/${this.feedbackId}`, this.oFeedBacKRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetFeedBacK();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oFeedBacKRequestDto = new FeedBacKRequestDto();
    this.feedbackId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.feedbackGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.feedbackId = Number(getSelectedItem.Id);
    this.oFeedBacKRequestDto.Feedback = getSelectedItem.Feedback;
    this.oFeedBacKRequestDto.ReferanceTypeID = Number(getSelectedItem.ReferanceTypeID);
    this.oFeedBacKRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oFeedBacKRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.feedbackGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

    this.feedbackId = Number(getSelectedItem.Id);
    this.oFeedBacKRequestDto.Feedback = getSelectedItem.Feedback;
    this.oFeedBacKRequestDto.ReferanceTypeID = Number(getSelectedItem.ReferanceTypeID);
    this.oFeedBacKRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oFeedBacKRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetFeedBacK();
  }



}
