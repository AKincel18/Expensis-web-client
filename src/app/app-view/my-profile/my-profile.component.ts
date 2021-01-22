import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/classes/user';
import { LocalStorageService } from 'src/app/local-storage.service';
import { RepeatPasswordEStateMatcher } from 'src/app/login/login.component';
import { IncomeRangeService } from 'src/app/services/income-range.service';
import { MyProfileService } from 'src/app/services/my-profile.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
  myProfileForm: FormGroup = null;
  loggedUser: User = null;
  passwordsMatcher = new RepeatPasswordEStateMatcher();
  minDate = new Date(1900, 0, 0);
  maxDate = new Date();
  bgClass: string;
  incomeRanges$ = this.incomeRangeService.getIncomeRanges();


  constructor(    
    private formBuilder: FormBuilder,
    private incomeRangeService: IncomeRangeService,
    private myProfileService: MyProfileService
    
  ) {
    this.loggedUser = LocalStorageService.getUser();
  }

  ngOnInit(): void {
    this.generateForm();
    this.setFields();
  }

  submitMyProfile() {
    this.myProfileService.editProfile(this.loggedUser,
                                      this.myProfileForm.value as User,
                                      this.myProfileForm.value.password);
  }
  private setFields() {
    this.myProfileForm.controls["email"].setValue(this.loggedUser.email);
    this.myProfileForm.controls["birth_date"].setValue(new Date(this.loggedUser.birth_date.toString()));
    this.myProfileForm.controls["gender"].setValue(this.loggedUser.gender);
    this.myProfileForm.controls["income_range"].setValue(this.loggedUser.income_range);
    this.myProfileForm.controls["monthly_limit"].setValue(this.loggedUser.monthly_limit);
    this.myProfileForm.controls["allow_data_collection"].setValue(this.loggedUser.allow_data_collection);
  }
  
  private generateForm() {
    this.myProfileForm = this.formBuilder.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^(.+)@(.+)$/),
          ]),
        ],
        birth_date: [null, Validators.required],
        gender: [null, Validators.required],
        income_range: [null, Validators.required],
        monthly_limit: [null, Validators.compose([Validators.min(0)])],
        allow_data_collection: [null, null],
        password: [
          '',
          this.customValidator(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-_,\.])[A-Za-z\d@$!%*#?&-_,\.]{5,64}/,
            "password"
          )
        ],
        cofirmationPassword: [
          '', 
          null
        ],

      },
      { validator: Utils.repeatPasswordValidator}
    );
  }

  /**
   * Validates a not empty field according to the pattern
   * @param regexPattern regex pattern
   * @param fieldName field name
   */  
  private customValidator(regexPattern: RegExp, fieldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value != '' && !regexPattern.test(control.value)) {
       let temp = {};
       temp[fieldName] = true;
        return temp;
      }
      return null;
    }
  }
}