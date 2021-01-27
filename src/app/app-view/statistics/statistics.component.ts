import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let user = LocalStorageService.getUser();
    if (!user.allow_data_collection) {
      this.router.navigate(['/app']);
      this.snackBar.open("Access denied! Allow data collection to use statistics", null, {
        duration: 5000,
      });
    }
  }

}
