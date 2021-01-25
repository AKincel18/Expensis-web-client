import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExpenseDialogComponent } from './add-edit-expense-dialog.component';

describe('AddEditExpenseDialogComponent', () => {
  let component: AddEditExpenseDialogComponent;
  let fixture: ComponentFixture<AddEditExpenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditExpenseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
