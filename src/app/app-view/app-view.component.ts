import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss'],
})
export class AppViewComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  public links = [
    { label: 'Statistics', link: 'statistics' },
    { label: 'Expenses', link: 'expenses' }
  ];
  myProfileLink = 'my-profile';

  onLogoutClicked(){
    this.authService.logout();
  }

  ngOnInit(): void {}
}
