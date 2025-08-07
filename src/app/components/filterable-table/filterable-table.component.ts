import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecuritiesFilter } from '../../models/securities-filter';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatTable,
    FilterBarComponent,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;
  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @Input() availableCurrencies: string[] = [];
  @Input() availableTypes: string[] = [];
  @Input() nameLabel: string = 'Name';
  @Input() currencyLabel: string = 'Currency';
  @Input() typeLabel: string = 'Type';
  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;
  @Output() filterChange = new EventEmitter<SecuritiesFilter>();
  @Output() pageChange = new EventEmitter<PageEvent>();
 @Input() totalCount: number = 0;

ngOnChanges() {
  console.log('isLoading in FilterableTable:', this.isLoading);
}

  filter: SecuritiesFilter = { skip: 0, limit: 10 };

  ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef)
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef)
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
//emits pageevent
  onPageChange(event: PageEvent): void {
    sessionStorage.setItem('pageSize', event.pageSize.toString());
    this.pageChange.emit(event);
  }
}
