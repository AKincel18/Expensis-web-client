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
import { flatMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../classes/register-request';

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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  submitLogin() {
    const { email, password } = this.login;
    this.authService.login(email, password);
  }

  submitRegister() {
    const registerForm = this.registerForm.value as RegisterRequest;
    const changeIndex = () => (this.currentTabIdx = 0);
    this.authService.register(registerForm, changeIndex);
  }

  ngOnInit() {
    this.generateForm();
    this.backgroundIndex = Math.floor(Math.random() * 3 + 1);
    this.bgClass = `login-bg-${this.backgroundIndex}`;
    console.log(this.backgroundIndex);
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
        birthDate: [null, Validators.required],
        gender: [null, Validators.required],
      },
      { validator: RepeatPasswordValidator }
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
export function RepeatPasswordValidator(group: FormGroup) {
  const password = group.controls.password.value;
  const passwordConfirmation = group.controls.cofirmationPassword.value;

  return password === passwordConfirmation ? null : { passwordsNotEqual: true };
}
