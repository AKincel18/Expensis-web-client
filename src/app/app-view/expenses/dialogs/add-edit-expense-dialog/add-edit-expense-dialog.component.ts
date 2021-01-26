import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService as LocalStorage } from '../../../../local-storage.service'
import { Expense } from '../../model/expense';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-add-edit-expense-dialog',
  templateUrl: './add-edit-expense-dialog.component.html',
  styleUrls: ['./add-edit-expense-dialog.component.scss']
})
export class AddEditExpenseDialogComponent implements OnInit {

  isEditDialog = false;
  expenseForm: FormGroup = null;
  maxDate = new Date();
  minDate = this.getFirstDayOfJoinedMonth();
  categories$ = this.categoriesService.getCategories();

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditExpenseDialogComponent>,
    private categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: Expense) { }

  ngOnInit() {

    if (this.data != null) {
      this.isEditDialog = true;
      this.initEdit();
    } else {
      this.initAddNew();
    }
  }

  initEdit() {
    this.expenseForm = this.formBuilder.group({
      id: [this.data.id],
      title: [this.data.title, [Validators.required]],
      description: [this.data.description],
      date: [this.data.date, Validators.required],
      category: [this.setCurrentCategory(), Validators.required],
      value: [this.data.value, Validators.required]
    });
  }

  private setCurrentCategory() {
    this.categories$.subscribe(
      categories => {
        for (let cat of categories) {
          if (cat.value === this.data.category) {
            this.expenseForm.controls['category'].setValue(cat.id);
            return;
          }
        }
        this.expenseForm.controls['category'].setValue(categories[0].id);
      }
    );
  }

  private initAddNew() {
    this.expenseForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      date: [new Date(), Validators.required],
      category: [null, Validators.required],
      value: [null, Validators.required]
    });
  }

  getFirstDayOfJoinedMonth() {
    var date_joined = LocalStorage.getUser().date_joined;
    date_joined.setDate(1);
    return date_joined;
  }

  get title() {
    return this.expenseForm.get('title');
  }
  get date() {
    return this.expenseForm.get('date');
  }
  get category() {
    return this.expenseForm.get('category');
  }
  get value() {
    return this.expenseForm.get('value');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.dialogRef.close({ data: this.expenseForm.value });
    }
  }

}
