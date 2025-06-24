import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { FileResponseDto } from '../../Models/RequestDto/FileResponseDto';
import { AgGridAngular } from 'ag-grid-angular';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { UploadedFileFilterDto, UploadedFileRequestDto } from '../../Models/RequestDto/UploadedFile';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  private UploadedFileGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public oUploadedFileFilterDto = new UploadedFileFilterDto();

  public oFileResponseDto = new FileResponseDto();
  constructor(public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService) {

  }
  ngOnInit(): void {
    this.GetUploadedFiles();
  }

  Filter() {
    this.GetUploadedFiles();
  }

  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oFileResponseDto = res;
          this.GetUploadedFiles();
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }

  public colDefsFileUpdload: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'FileName', width: 150, headerName: 'File Name', filter: true },
    { field: 'FileSize', width: 150, headerName: 'File Size', filter: true },
    { field: 'FileData', width: 150, headerName: 'Preview URL', filter: true },
    {
    headerName: 'Action',
    field: 'FileData',
    cellRenderer: (params: { value: any; }) => {
      const button = document.createElement('button');
      button.innerText = 'Copy the URL';
      button.classList.add('btn', 'btn-sm', 'btn-primary');
      button.addEventListener('click', () => {
        navigator.clipboard.writeText(params.value || '');
        // alert('Preview URL copied: ' + (params.value || ''));
      });
      return button;
    },
    width: 100
  }
  ];

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetUploadedFiles();
  }

  private GetUploadedFiles() {
    let currentUser = CommonHelper.GetUser();
    this.http.Post(`UploadedFile/GetUploadedFile?pageNumber=${this.pageIndex}`, this.oUploadedFileFilterDto).subscribe(
      (res: any) => {
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

  onGridReadyTransection(params: any) {
    this.UploadedFileGridApi = params.api;
    this.rowData = [];
  }

  copyToClipboard(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard:', text);
  }).catch(err => {
    console.error('Clipboard copy failed:', err);
  });
}

}
