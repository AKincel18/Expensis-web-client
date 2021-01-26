import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTabLink, MatTabNav } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { LocalStorageService as LocalStorage } from '../local-storage.service';

@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss'],
})
export class AppViewComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    let user = LocalStorage.getUser();
    if (!user.allow_data_collection) {
      this.links = [
        { label: 'Expenses', link: 'expenses' },
        { label: 'My profile', link: 'my-profile' },
      ];
    }
  }

  @ViewChild(MatTabNav) matTabNav: MatTabNav;
  @ViewChildren(MatTabLink) linkElements: QueryList<MatTabLink>;

  public links = [
    { label: 'Statistics', link: 'statistics' },
    { label: 'Expenses', link: 'expenses' },
  ];
  myProfileLink = 'my-profile';

  onLogoutClicked() {
    this.authService.logout();
  }

  ngOnInit(): void {}
}
