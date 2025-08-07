import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { Observable, BehaviorSubject, tap, map, finalize } from 'rxjs';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { SecuritiesFilter } from '../../models/securities-filter';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    FilterBarComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
    MatPaginatorModule
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  //filters: SecuritiesFilter = {};
  columnLabels = {
    name: 'Name',
    type: 'Type',
    currency: 'Currency',
  };

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected securities$: Observable<Security[]> = new Observable<Security[]>();
  protected totalCount: number = 0;
  filters: SecuritiesFilter = { skip: 0, limit: 10 };

  // protected securities$: Observable<Security[]> = this._securityService
  //   .getSecurities({})
  //   .pipe(indicate(this.loadingSecurities$));

  availableCurrencies: string[] = [];
  availableTypes: string[] = [];

  //Load data initially
  ngOnInit() {
    this.loadData();
    this.securities$.subscribe(securities => {
      this.availableCurrencies = [...new Set(securities.map(s => s.currency))];
      this.availableTypes = [...new Set(securities.map(s => s.type))];
    });
  }

  // this triggers when filter bar emits a new filter set
  onFilterChange(filter: SecuritiesFilter) {
    this.filters = {
      ...this.filters,
      ...filter,
      limit: filter.limit ?? this.filters.limit,
      skip: 0 // reset paging
    };

    this.loadData();
  }

  loadData(): void {
    console.log(this.filters);

    console.log('Loading started');
    this.loadingSecurities$.next(true);

    const normalizedFilters = {
      ...this.filters,
      isPrivate: this.filters.isPrivate ?? false
    };

    this.securities$ = this._securityService.getSecurities(normalizedFilters).pipe(
      tap(response => {
        this.totalCount = response.totalCount;
      }),
      map(response => response.data),
      tap(securities => {
        // Merging new currencies without removing old ones- used for filter option dropdown
        const newCurrencies = securities.map(s => s.currency);
        this.availableCurrencies = Array.from(new Set([...this.availableCurrencies, ...newCurrencies]));

        // Merging new types without removing old ones for dropdown option
        const newTypes = securities.map(s => s.type);
        this.availableTypes = Array.from(new Set([...this.availableTypes, ...newTypes]));
      }),
      finalize(() => {
        this.loadingSecurities$.next(false);
        console.log('Loading stopped');
      })
    );
  }

  // Triggers when user changes pagination page or size

  onPageChange(event: PageEvent) {
    this.filters = {
      ...this.filters,
      skip: event.pageIndex * event.pageSize,
      limit: event.pageSize
    };

    this.loadData();
  }
  // loadData(): void {
  //   console.log(this.filters);

  //   console.log('Loading started...');
  //   this.loadingSecurities$.next(true);
  //   const normalizedFilters = {
  //     ...this.filters,
  //     isPrivate: this.filters.isPrivate ?? false
  //   };
  //   this.securities$ = this._securityService.getSecurities(normalizedFilters).pipe(
  //     tap(response => {
  //       this.totalCount = response.totalCount;
  //     }),
  //     map(response => response.data),
  //     finalize(() => {
  //       // Stop spinner once observable completes or errors
  //       this.loadingSecurities$.next(false);
  //       console.log('Loading stopped...');

  //     })
  //   );
  // }


}
