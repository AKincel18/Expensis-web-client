import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { StatisticsRequest } from 'src/app/classes/statistics-request';
import { StatisticsService } from '../statistics.service';

enum FilterOptionType {
  INCOME_RANGE,
  AGE_RANGE,
  GENDER,
}

@Component({
  selector: 'app-statistics-header',
  templateUrl: './statistics-header.component.html',
  styleUrls: ['./statistics-header.component.scss'],
})
export class StatisticsHeaderComponent implements OnInit {
  private subs = new Subscription();
  public viewType$ = new BehaviorSubject<string>('Separated');
  public filterOptions = [
    {
      name: 'Income range',
      controlName: 'income_range',
      value: FilterOptionType.INCOME_RANGE,
    },
    {
      name: 'Age range',
      controlName: 'age_range',
      value: FilterOptionType.AGE_RANGE,
    },
    {
      name: 'Gender',
      controlName: 'gender',
      value: FilterOptionType.GENDER,
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private statisticsService: StatisticsService
  ) {}

  form = this.formBuilder.group({
    name: ['Separated', Validators.required],
    filters: this.formBuilder.group({
      income_range: [0],
      age_range: [0],
      gender: [0],
      filterType: [FilterOptionType.INCOME_RANGE],
    }),
  });

  submitForm() {
    const request = this.form.value;
    request.filters.income_range = request.filters.income_range ? 1 : 0;
    request.filters.age_range = request.filters.age_range ? 1 : 0;
    request.filters.gender = request.filters.gender ? 1 : 0;
    if (request.name === 'Separated') {
      switch (request.filters.filterType as FilterOptionType) {
        case FilterOptionType.INCOME_RANGE: {
          request.filters.income_range = 1;
          request.filters.age_range = 0;
          request.filters.gender = 0;
          break;
        }
        case FilterOptionType.AGE_RANGE: {
          request.filters.income_range = 0;
          request.filters.age_range = 1;
          request.filters.gender = 0;
          break;
        }
        case FilterOptionType.GENDER: {
          request.filters.income_range = 0;
          request.filters.age_range = 0;
          request.filters.gender = 1;
          break;
        }
      }
    }
    delete request.filters.fitlerType;
    this.statisticsService.fetchStatistics(request);
  }

  ngOnInit(): void {
    this.subs.add(
      this.form.get('name').valueChanges.subscribe((val) => {
        this.viewType$.next(val);
      })
    );
  }
}
