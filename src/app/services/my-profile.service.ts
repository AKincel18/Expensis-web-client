import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { EditUserRequest } from "../classes/my-profile-request";
import { User } from "../classes/user";
import { EndpointPaths } from "../endpoint-paths";
import { LocalStorageService } from "../local-storage.service";
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
      let requestBody: any = this.editUserRequest = editUserRequest;
      if (password != '') {
        requestBody.username = editUserRequest.email;
        requestBody.password = password;
      }
      requestBody.birth_date = Utils.parseDate(requestBody.birth_date);
      this.http
      .put(environment.apiUrl + EndpointPaths.USERS, requestBody)
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

    private updateLoggedUser() {
      this.loggedUser.email = this.editUserRequest.email;
      this.loggedUser.birth_date = this.editUserRequest.birth_date;
      this.loggedUser.gender = this.editUserRequest.gender;
      this.loggedUser.income_range = this.editUserRequest.income_range;
      this.loggedUser.monthly_limit = this.editUserRequest.monthly_limit;
      this.loggedUser.allow_data_collection = this.editUserRequest.allow_data_collection;
      LocalStorageService.setUser(this.loggedUser);
    }
  }