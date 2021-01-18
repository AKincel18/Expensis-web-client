import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { IncomeRangeResponse } from 'src/app/classes/income-range-response';
import { User } from 'src/app/classes/user';
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
  incomeRange: string = null;

  tmp = this.http
  .get('http://localhost:8000/income-ranges/')
  .subscribe(
      res => {
          let ranges = res as IncomeRangeResponse[];
          for (let index = 0; index < ranges.length; index++) {
              if (ranges[index].id == this.loggedUser.income_range) {
                  this.incomeRange = `${ranges[index].range_from}-${ranges[index].range_to}`;
              }
          }
      }
  )

  constructor(    
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private incomeRangeService: IncomeRangeService,
    private myProfileService: MyProfileService,
    private http: HttpClient
    
  ) {
    this.loggedUser = authService.getUserData();
  }

  ngOnInit(): void {
    this.generateForm();
  }

  submitMyProfile() {
    this.myProfileService.editProfile(this.loggedUser,
                                      this.myProfileForm.value as User,
                                      this.myProfileForm.value.password);
  }

  setEmailPlaceholder() : string {
    return this.loggedUser.email;
  }

  setMonthlyLimitPlaceholder() : number {
    return this.loggedUser.monthly_limit;
  }

  setGenderPlaceholder() : string {
    if (this.loggedUser.gender == 'F') {
      return "Female";
    } else {
      return "Male";
    }
  }

  setIncomeRangePlaceholder() : string {
    return this.incomeRange;
  }

  setDatePlaceholder() : string {
      return Utils.parseDateToString(this.loggedUser.birth_date);
  }
  
  private generateForm() {
    this.myProfileForm = this.formBuilder.group(
      {
        email: [
          '',
          this.customValidator(
            /^(.+)@(.+)$/,
            "email"
          )
        ],
        birth_date: [null, null],
        gender: [null, null],
        income_range: [null, null],
        monthly_limit: [null, Validators.compose([Validators.min(0)])],
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