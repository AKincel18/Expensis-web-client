import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Expense } from './model/expense';
import { environment } from 'src/environments/environment';
import { EndpointPaths } from 'src/app/endpoint-paths';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private currentMaxResults = 0;

  constructor(private http: HttpClient) { }

  httpHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  getExpensesList(pageSize: number, pageIndex: number, year: number, month: number, title?: string) {
    let params = this.getExpenseListParams(pageSize, pageIndex, year, month, title);
    return this.http.get<Expense[]>(environment.apiUrl + EndpointPaths.EXPENSES, { params: params, observe: 'response' }).pipe(retry(1), catchError(this.errorHandler));
  }

  private getExpenseListParams(pageSize: number, pageIndex: number, year: number, month: number, title?: string) {
    let params = new HttpParams()
      .set('pageSize', String(pageSize))
      .set('pageIndex', String(pageIndex))
      .set('year', String(year))
      .set('month', String(month));

    if (title != null) {
      params = params.append('title', String(title));
    }

    return params;
  }

  deleteExpense(id: number) {
    return this.http.delete(environment.apiUrl + EndpointPaths.EXPENSES + id + '/').pipe(retry(1), catchError(this.errorHandler));
  }

  getExpensesSum(year: number, month: number) {
    let params = new HttpParams()
      .set('year', String(year))
      .set('month', String(month));
    return this.http.get<number>(environment.apiUrl + EndpointPaths.EXPENSES_SUM, {params: params}).pipe(retry(1), catchError(this.errorHandler));
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(error.status);
  }

  getCurrentMaxResults() {
    return this.currentMaxResults;
  }
}
