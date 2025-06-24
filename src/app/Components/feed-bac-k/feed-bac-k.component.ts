import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { ServiceDetailFilterDto, ServiceDetailRequestDto } from '../../Models/RequestDto/ServiceDetail';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-feed-bac-k',
  standalone: true,
  
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, NgxEditorModule, FormsModule],
  templateUrl: './feed-bac-k.component.html',
  styleUrl: './feed-bac-k.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class FeedBacKComponent implements OnInit{

  private feedbackGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public oServiceDetailFilterDto = new ServiceDetailFilterDto();
  public oServiceDetailRequestDto = new ServiceDetailRequestDto();

  public servicedetailId = 0;
  public editor: Editor = new Editor();
  public toolbar!: Toolbar;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}
