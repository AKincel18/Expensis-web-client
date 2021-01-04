import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
      .get('http://localhost:8000/age-ranges/')
      .subscribe((res) => console.log(res));
  }
}
