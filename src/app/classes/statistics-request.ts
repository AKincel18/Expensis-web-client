interface Filters {
  income_range: 0 | 1;
  age_range: 0 | 1;
  gender: 0 | 1;
}

export interface StatisticsRequest {
  name: 'Combined' | 'Separated' | 'Categories';
  filters: Filters;
}
