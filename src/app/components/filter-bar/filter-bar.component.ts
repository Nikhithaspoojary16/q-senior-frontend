import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecuritiesFilter } from '../../models/securities-filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  // Outputs to emit filter change
  @Output() filterChange = new EventEmitter<SecuritiesFilter>();

  // Inputs for dynamic dropdown options
  @Input() availableCurrencies: string[] = [];
  @Input() availableTypes: string[] = [];

  // Inputs for dynamic labels for dropdown
  @Input() nameLabel: string = 'Name';
  @Input() currencyLabel: string = 'Currency';
  @Input() typeLabel: string = 'Type';

  // Intial filter state
  filters: SecuritiesFilter = {
    name: '',
    types: [],
    currencies: [],
    isPrivate: undefined
  };

 //To emits the latest filter value
  onFiltersUpdated(): void {
    this.filterChange.emit(this.filters);
  }

 //To reset to initial state
  clearFilters(): void {
    this.filters = {
      name: '',
      currencies: [],
      types: [],
      isPrivate: undefined,
      skip: 0,
      limit: Number(sessionStorage.getItem('pageSize')) || 10    };
      
    this.filterChange.emit(this.filters);
  }

  //to clear the name when we click on x icon in name input
  clearNameFilter(): void {
    this.filters.name = '';
    this.onFiltersUpdated();
  }

  //method is to check if any filter applied to enable and disable clear all filter button
  isAnyFilterApplied(): boolean {
    return (
      !!this.filters.name?.trim() ||
      (this.filters.currencies?.length ?? 0) > 0 ||
      (this.filters.types?.length ?? 0) > 0 ||
      this.filters.isPrivate === true
    );
  }
}
