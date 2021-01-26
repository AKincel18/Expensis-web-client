import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss'],
})
export class AppViewComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {
    let user = authService.getUserData();
    if (!user.allow_data_collection) {
      this.links = [
        { label: 'Expenses', link: 'expenses' },
        { label: 'My profile', link: 'my-profile' },
      ];
    }
  }
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
