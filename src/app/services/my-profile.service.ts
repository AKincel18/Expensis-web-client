import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EditUserRequest } from "../classes/my-profile-request";
import { User } from "../classes/user";
import { Utils } from "../utils/utils";

@Injectable({
    providedIn: 'root',
  })
  export class MyProfileService {
    loggedUser: User = null;
    editUserRequest: EditUserRequest = null; 
    constructor(
      private http: HttpClient,
      private router: Router,
      private snackBar: MatSnackBar 
    ) {}
    
    editProfile(loggedUser: User, editUserRequest: EditUserRequest, password: string) {
      this.loggedUser = loggedUser;
      this.editUserRequest = editUserRequest;
      this.prepareRequestBody();
      let requestBody: any = this.editUserRequest;
      if (password != '') {
        requestBody.username = this.editUserRequest.email;
        requestBody.password = password;
      }
      this.http
      .put('http://localhost:8000/users/', requestBody)
      .subscribe(
        (res) => {
        this.updateLoggedUser();
        this.router.navigate(['/app/expenses']);
        this.snackBar.open('Edit profile succesfully!', null, {
          duration: 5000,
        });
      },
        (err: HttpErrorResponse) =>  {
          let msgError = Utils.getFirstError(err.error);
          this.snackBar.open(msgError, null, {
              duration: 5000, 
            });
        }
      );

    }

    private prepareRequestBody() {
      if(this.editUserRequest.email == '') {
        this.editUserRequest.email =  this.loggedUser.email;
      }

      if (this.editUserRequest.birth_date == null) {
        this.editUserRequest.birth_date = this.loggedUser.birth_date;
      }
      else {
        this.editUserRequest.birth_date = Utils.parseDate(this.editUserRequest.birth_date);
      }

      if (this.editUserRequest.gender == null) {
        this.editUserRequest.gender = this.loggedUser.gender;
      }
        
      if (this.editUserRequest.income_range == null) {
        this.editUserRequest.income_range = this.loggedUser.income_range;
      }
  
      if (this.editUserRequest.monthly_limit == null) {
        this.editUserRequest.monthly_limit = this.loggedUser.monthly_limit;
      }
    }

    private updateLoggedUser() {
      this.loggedUser.email = this.editUserRequest.email;
      this.loggedUser.birth_date = this.editUserRequest.birth_date;
      this.loggedUser.gender = this.editUserRequest.gender;
      this.loggedUser.income_range = this.editUserRequest.income_range;
      this.loggedUser.monthly_limit = this.editUserRequest.monthly_limit;
    }
  }