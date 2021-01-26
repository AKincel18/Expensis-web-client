import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, retry } from 'rxjs/operators';
import { EndpointPaths } from 'src/app/endpoint-paths';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }
  
  public getCategories() {
    return this.http.get<Category[]>(environment.apiUrl + EndpointPaths.CATEGORIES).pipe(retry(1));
  }

}
