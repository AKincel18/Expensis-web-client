import { Component, OnInit } from '@angular/core';
import { Expense } from './model/expense';
import { ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ExpensesService } from './expenses.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { AuthService } from 'src/app/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteExpenseDialogComponent } from './dialogs/delete-expense-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {LocalStorageService as LocalStorage} from '../../local-storage.service'
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ExpensesComponent implements OnInit {
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  expenses: any = [];
  displayedColumns: string[] = ['date', 'title', 'category', 'value'];
  paginatorConfig = {
    pageSizeOptions: [10, 20, 50],
    pageSize: 10,
    maxItems: 100,
    pageIndex: 0
  }
  isLoadingResults = true;
  pageEvent: PageEvent;
  titleFilter: string;
  titleFilterInputText: string;
  dateFilter: Date = new Date();
  dateFilterInput = new FormControl(moment());
  currentMonthString = "Current month";
  maxDate = new Date();
  minDate = LocalStorage.getUser().date_joined;
  expandedElement: Expense | null;
  expensesSum: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private expenseService: ExpensesService,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getPaginatedExpenses();
  }

  getPaginatedExpenses(event?: PageEvent) {
    this.isLoadingResults = true;
    if (event != null) {
      this.paginatorConfig.pageIndex = event.pageIndex;
      this.paginatorConfig.pageSize = event.pageSize;
    }
    var year = this.dateFilter.getFullYear()
    var month = this.dateFilter.getMonth() + 1
    this.getExpensesSum(year, month);
    this.expenseService.getExpensesList(this.paginatorConfig.pageSize, this.paginatorConfig.pageIndex + 1, year, month, this.titleFilter).subscribe(
      data => {
        this.expenses = data.body;
        this.isLoadingResults = false;
        this.paginatorConfig.maxItems = Number(data.headers.get('X-MAX-RESULTS'));
      },
      () => {
        this.isLoadingResults = false;
        this.openSnackBar("Unexpected error during expenses fetch!")
      }
    )

    return event;
  }

  filterExpenses() {
    this.titleFilter = this.titleFilterInputText;
    this.dateFilter = this.dateFilterInput.value.toDate();
    this.paginatorConfig.pageIndex = 0;
    this.getPaginatedExpenses();
    var currentDate = new Date();
    if (currentDate.getMonth() == this.dateFilter.getMonth() && currentDate.getFullYear() == this.dateFilter.getFullYear()) {
      this.currentMonthString = "Current month";
    } else {
      this.currentMonthString = this.monthNames[this.dateFilter.getMonth()] + " " + this.dateFilter.getFullYear();
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateFilterInput.value;
    ctrlValue.year(normalizedYear.year());
    this.dateFilterInput.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateFilterInput.value;
    ctrlValue.month(normalizedMonth.month());
    this.dateFilterInput.setValue(ctrlValue);
    datepicker.close();
  }

  onDeletePressed(id: number) {
    const dialogRef = this.dialog.open(DeleteExpenseDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log(typeof (result));
      if (true == result) {
        this.expenseService.deleteExpense(id).subscribe(
          () => {
            this.getPaginatedExpenses();
            this.openSnackBar("Expense has been deleted successfully!");
          },
          () => {
            this.openSnackBar("Delete failed! Please try again.");
          }
        )
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
    });
  }

  getExpensesSum(year: number, month: number) {
    this.expenseService.getExpensesSum(year, month).subscribe(
      data => {
        this.expensesSum = -data;
      },
      () => {
        this.expensesSum = 0;
        this.openSnackBar("Error while getting expenses sum! Try again later.")
      }
    )
  }
}
