import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subscription } from 'rxjs';
import { StatisticsRequest } from 'src/app/classes/statistics-request';
import { StatisticsResponse } from 'src/app/classes/statistics-response';
import { StatisticsView } from 'src/app/classes/statistics-view';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  statistics$ = new ReplaySubject();
  statisticsSub: Subscription;

  fetchStatistics(request: StatisticsRequest): void {
    if (this.statisticsSub) {
      this.statisticsSub.unsubscribe();
    }
    this.statisticsSub = this.http
      .post<StatisticsResponse[]>('http://localhost:8000/stats/', request)
      .subscribe(
        (res) => {
          const view = {} as StatisticsView;
          view.type = request.name;
          view.data = res.map((stat) => ({
            name: stat.name_value,
            series: [
              {
                name: 'Me',
                value: stat.user_value,
              },
              {
                name: 'Others',
                value: stat.all_value,
              },
            ],
          }));
          this.statistics$.next(view);
        },
        (err) => {
          this.snackBar.open(err.message);
        },
        () => {
          this.statisticsSub = null;
        }
      );
  }
}
