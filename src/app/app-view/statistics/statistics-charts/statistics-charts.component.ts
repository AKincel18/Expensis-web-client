import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics.service';

@Component({
  selector: 'app-statistics-charts',
  templateUrl: './statistics-charts.component.html',
  styleUrls: ['./statistics-charts.component.scss'],
})
export class StatisticsChartsComponent implements OnInit {
  constructor(public statisticsService: StatisticsService) {}

  ngOnInit(): void {}
}
