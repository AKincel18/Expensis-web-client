import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { EndpointPaths } from '../endpoint-paths';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss'],
})
export class AppViewComponent implements OnInit {
  constructor(private http: HttpClient) {}
  public links = [
    { label: 'Statistics', link: 'statistics' },
    { label: 'Expenses', link: 'expenses' },
    { label: 'My profile', link: 'my-profile' },
  ];

  ngOnInit(): void {
    this.http
      .get(environment.apiUrl + EndpointPaths.AGE_RANGES)
      .subscribe((res) => console.log(res));
  }
}
