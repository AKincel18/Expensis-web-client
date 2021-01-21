import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../classes/register-request';
import {
  IncomeRangeOption,
  IncomeRangeResponse,
} from '../classes/income-range-response';
import { environment } from 'src/environments/environment';
import { EndpointPaths } from '../endpoint-paths';
import { LocalStorageService as LocalStorage } from '../local-storage.service';import { Utils } from '../utils/utils';
import { IncomeRangeService } from '../services/income-range.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login: Login = {};
  register: RegisterRequest = null;
  registerForm: FormGroup = null;
  backgroundIndex: number;
  bgClass: string;
  currentTab: number = 0;
  passwordsMatcher = new RepeatPasswordEStateMatcher();
  currentTabIdx = 0;
  minDate = new Date(1900, 0, 0);
  maxDate = new Date();
  incomeRanges$ = this.incomeRangeService.getIncomeRanges();
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private incomeRangeService: IncomeRangeService,
  ) {}

  submitLogin() {
    const { email, password } = this.login;
    this.authService.login(email, password);
  }

  submitRegister() {
    const registerForm = this.registerForm.value as RegisterRequest;
    const changeIndex = () => (this.currentTabIdx = 0);
    this.authService.register(registerForm, changeIndex, this.registerForm.controls);
  }

  ngOnInit() {
    if (LocalStorage.getAccessToken()) {
      this.authService.loginByRefreshToken();
      this.router.navigate(['/app']);
    } else {
      this.generateForm();
      this.backgroundIndex = Math.floor(Math.random() * 3 + 1);
      this.bgClass = `login-bg-${this.backgroundIndex}`;
      console.log(this.backgroundIndex);
    }
  }

  private generateForm() {
    this.registerForm = this.formBuilder.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-_,\.])[A-Za-z\d@$!%*#?&-_,\.]{5,64}/
            ),
          ]),
        ],
        cofirmationPassword: ['', Validators.compose([Validators.required])],
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
        allow_data_collection: [null, null]
      },
      { validator: Utils.repeatPasswordValidator }
    );
  }
}

interface Login {
  email?: string;
  password?: string;
}

export class RepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (
      control &&
      control.parent.get('password').value !==
        control.parent.get('cofirmationPassword').value
    );
  }
}