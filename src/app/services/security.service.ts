import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities1(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const filteredSecurities = this._filterSecurities(securityFilter).slice(
      securityFilter?.skip ?? 0,
      securityFilter?.limit ?? 100
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

getSecurities(securityFilter?: SecuritiesFilter): Observable<{ data: Security[]; totalCount: number }> {
  const allFiltered = this._filterSecurities(securityFilter);
  const paged = allFiltered.slice(
    securityFilter?.skip ?? 0,
    (securityFilter?.skip ?? 0) + (securityFilter?.limit ?? 100)
  );

  return of({ data: paged, totalCount: allFiltered.length }).pipe(delay(1000));
}

  
private _filterSecurities(
  securityFilter: SecuritiesFilter | undefined
): Security[] {
  if (!securityFilter) return SECURITIES;

  return SECURITIES.filter((s) =>
    (!securityFilter.name ||
      s.name.toLowerCase().includes(securityFilter.name.toLowerCase())) &&
    (!securityFilter.types ||
      securityFilter.types.length === 0 ||
      securityFilter.types.some((type) => s.type === type)) &&
    (!securityFilter.currencies ||
      securityFilter.currencies.length === 0 ||
      securityFilter.currencies.some((currency) => s.currency === currency)) &&
    (securityFilter.isPrivate === undefined ||
      securityFilter.isPrivate === s.isPrivate)
  );
}

  


  
}
